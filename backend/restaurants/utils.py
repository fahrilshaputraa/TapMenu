from rest_framework.exceptions import PermissionDenied, ValidationError

from users.models import UserRole


def get_user_restaurant(user):
    if not getattr(user, 'is_authenticated', False):
        return None

    owned_restaurant = getattr(user, 'owned_restaurant', None)
    if owned_restaurant is not None:
        return owned_restaurant

    if getattr(user, 'restaurant_id', None):
        return user.restaurant

    return None


def get_default_appearance_payload(restaurant):
    return {
        'hero_title': restaurant.name,
        'hero_subtitle': restaurant.description or 'Menu digital restoran',
    }


def require_user_restaurant(user):
    restaurant = get_user_restaurant(user)
    if restaurant is None:
        raise ValidationError('Restaurant profile has not been configured for this account.')
    return restaurant


def ensure_roles(user, allowed_roles):
    if getattr(user, 'is_superuser', False):
        return

    if user.role not in allowed_roles:
        raise PermissionDenied('You do not have permission to access this resource.')


OWNER_ACCESS_ROLES = {UserRole.OWNER, UserRole.MANAGER}
STAFF_ACCESS_ROLES = {UserRole.OWNER, UserRole.MANAGER, UserRole.CASHIER, UserRole.KITCHEN}
