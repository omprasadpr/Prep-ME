import bcrypt

# Passlib 1.7.4 compatibility fix with bcrypt 4.0+
if not hasattr(bcrypt, "__about__"):
    try:
        import bcrypt.__about__  # type: ignore
    except ImportError:
        class DummyAbout:
            __version__ = getattr(bcrypt, "__version__", "4.0.0")
        bcrypt.__about__ = DummyAbout()  # type: ignore

from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)