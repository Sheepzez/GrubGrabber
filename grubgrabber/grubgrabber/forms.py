from django import forms
from django.contrib.auth.models import User
from grubgrabber.models import Like, Favourite, Dislike
from grubgrabber.models import UserProfile

class UserForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

		
class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ('about', 'picture')
        
class Add_Favourite(forms.ModelForm):
    class Meta:
        model = Favourite
        
