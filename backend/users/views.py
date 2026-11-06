from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from rest_framework import status
from users.models import User
from users.serializers import UserSerializer, RegisterUserSerializer
import zeep

class UserApiViewSet(ModelViewSet):
    """
    CRUD completo para usuarios gestionado por administradores.
    """
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):
        if 'password' in request.data:
            request.data['password'] = make_password(request.data['password'])
        return super().create(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if "password" in request.data:
            request.data["password"] = make_password(request.data["password"])
        else:
            request.data["password"] = request.user.password
        return super().partial_update(request, *args, **kwargs)


class UserView(APIView):
    """
    Web Service Propio: Endpoint protegido /api/v1/auth/me/
    Devuelve los datos del usuario autenticado con token JWT (Bearer Token).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class RegisterUserView(ModelViewSet):
    """
    Registro público de usuarios para la aplicación Frontend en React.
    """
    permission_classes = [AllowAny]
    serializer_class = RegisterUserSerializer
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'Usuario registrado exitosamente',
                'user': {
                    'username': user.username,
                    'email': user.email,
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SoapCountryView(APIView):
    """
    Consumo de Servicio SOAP Público (Requisito Unidad 3)
    Consume el servicio WSDL público de información de países usando la librería zeep.
    WSDL: http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL
    """
    permission_classes = [AllowAny]

    def get(self, request):
        country_code = request.query_params.get('code', 'MX').upper()
        wsdl_url = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL'

        try:
            # Inicializar el cliente SOAP con Zeep
            client = zeep.Client(wsdl=wsdl_url)
            # Invocar la operación SOAP CountryName
            country_name = client.service.CountryName(sCountryISOCode=country_code)

            return Response({
                'status': 'success',
                'service': 'CountryInfoService (SOAP 1.1)',
                'wsdl_url': wsdl_url,
                'library': 'zeep',
                'operation': 'CountryName',
                'country_code': country_code,
                'country_name': str(country_name),
            }, status=status.HTTP_200_OK)
        except Exception as e:
            # Fallback en caso de corte o bloqueo de red
            fallback_map = {
                'MX': 'Mexico',
                'US': 'United States',
                'ES': 'Spain',
                'CO': 'Colombia',
                'AR': 'Argentina',
            }
            return Response({
                'status': 'partial_success',
                'note': f'Error de red al consultar servicio SOAP: {str(e)}',
                'country_code': country_code,
                'country_name': fallback_map.get(country_code, f'Country {country_code}'),
            }, status=status.HTTP_200_OK)
