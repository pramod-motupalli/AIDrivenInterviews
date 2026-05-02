from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Check if user is approved
        if self.user.role == 'recruiter' and not self.user.is_approved:
            raise serializers.ValidationError("Your account is pending admin approval.")
            
        data['role'] = self.user.role
        data['email'] = self.user.email
        return data

class RecruiterRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            role='recruiter',
            is_approved=False  # Must be approved by admin
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'role', 'is_approved', 'created_at', 'is_active')
        read_only_fields = ('id', 'email', 'role', 'created_at')
