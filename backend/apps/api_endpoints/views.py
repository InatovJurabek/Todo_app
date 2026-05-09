from rest_framework.viewsets import ModelViewSet
from apps.models import Todo
from .serializers import TodoSerializer
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


class TodoViewSet(ModelViewSet):
    serializer_class = TodoSerializer

    def get_queryset(self):
        queryset = Todo.objects.all().order_by('-created_at')
        completed = self.request.query_params.get('completed')

        if completed is not None:
            queryset = queryset.filter(completed=completed.lower() == 'true')

        return queryset
