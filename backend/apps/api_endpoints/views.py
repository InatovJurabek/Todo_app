from rest_framework.viewsets import ModelViewSet
from apps.models import Todo
from .serializers import TodoSerializer
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


class TodoViewSet(ModelViewSet):
    queryset = Todo.objects.all().order_by('-created_at')
    serializer_class = TodoSerializer
    
def get_queryset(self):
    queryset = Todo.objects.all()
    completed = self.request.query_params.get('completed')

    if completed is not None:
        queryset = queryset.filter(completed=completed.lower() == 'true')
    return queryset


@csrf_exempt
def add_todo(request):
    if request.method == "POST":
        data = json.loads(request.body)
        todo = Todo.objects.create(title=data['title'])
        return JsonResponse({"id": todo.id, "title": todo.title})