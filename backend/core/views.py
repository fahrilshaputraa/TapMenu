from django.db import connections
from django.http import JsonResponse
from django.utils import timezone


def health(request):
    """Lightweight health check endpoint."""
    db_ready = True
    try:
        connections['default'].cursor()
    except Exception:
        db_ready = False

    status = 'ok' if db_ready else 'degraded'
    return JsonResponse(
        {
            'status': status,
            'database': db_ready,
            'timestamp': timezone.now().isoformat(),
        }
    )
