# myapp/decorators.py
from functools import wraps
from django.utils.decorators import method_decorator
from django.core.exceptions import PermissionDenied
import logging
from django.core.exceptions import PermissionDenied


logger = logging.getLogger('django')

from functools import wraps
from django.utils.decorators import method_decorator
import logging

logger = logging.getLogger('django')

def log_request(view_func):
    @wraps(view_func)
    def _wrapped_view_func(request, *args, **kwargs):
        logger.info(f"Handling {request.method} request to {request.path}")
        response = view_func(request, *args, **kwargs)
        if response.status_code >= 400:
            logger.error(f"Error response: {response.status_code}, URL: {request.path}")
        else:
            logger.info(f"Response status code: {response.status_code}, URL: {request.path}")
        return response
    return _wrapped_view_func

def class_log_request(view):
    return method_decorator(log_request, name='dispatch')(view)

def require_permissions(permissions):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view_func(request, *args, **kwargs):
            if not request.user.is_authenticated:
                raise PermissionDenied("User not authenticated.")
            if not request.user.has_perms(permissions):
                raise PermissionDenied("Insufficient permissions.")
            return view_func(request, *args, **kwargs)
        return _wrapped_view_func
    return decorator



