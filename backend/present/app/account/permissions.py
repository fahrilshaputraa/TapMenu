from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """
    Permission for restaurant admin users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.user_type == 'admin'
        )


class IsKasir(permissions.BasePermission):
    """
    Permission for kasir/cashier users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.user_type in ['admin', 'kasir']
        )


class IsKitchen(permissions.BasePermission):
    """
    Permission for kitchen users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.user_type in ['admin', 'kitchen']
        )


class IsStaff(permissions.BasePermission):
    """
    Permission for any restaurant staff (admin, kasir, kitchen).
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.user_type in ['admin', 'kasir', 'kitchen']
        )


class IsCustomer(permissions.BasePermission):
    """
    Permission for customer users.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.user_type == 'customer'
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission for resource owner or admin.
    """

    def has_object_permission(self, request, view, obj):
        # Admin can access everything
        if request.user.user_type == 'admin':
            return True

        # Check if user owns the object
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'customer'):
            return obj.customer == request.user

        return False


class IsRestaurantStaff(permissions.BasePermission):
    """
    Permission to check if user is staff of a specific restaurant.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        # Get restaurant from view kwargs or request data
        restaurant_id = view.kwargs.get('restaurant_id') or request.data.get('restaurant')

        if not restaurant_id:
            return False

        # Check if user is staff of this restaurant
        return request.user.staff_profiles.filter(
            restaurant_id=restaurant_id,
            status='active'
        ).exists()


class IsRestaurantAdmin(permissions.BasePermission):
    """
    Permission to check if user is admin of a specific restaurant.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        restaurant_id = view.kwargs.get('restaurant_id') or request.data.get('restaurant')

        if not restaurant_id:
            return False

        return request.user.staff_profiles.filter(
            restaurant_id=restaurant_id,
            role='admin',
            status='active'
        ).exists()


class AllowAny(permissions.BasePermission):
    """
    Allow any access (for public endpoints).
    """

    def has_permission(self, request, view):
        return True


class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    """
    Allow read-only for unauthenticated, full access for authenticated.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated
