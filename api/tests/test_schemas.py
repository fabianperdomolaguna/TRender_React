import pytest
from pydantic import ValidationError

from app.schemas.auth import EntryLogin, EntryRegistry
from app.schemas.courses import EntryCourse
from app.schemas.roles import EntryRole
from app.schemas.sells import EntrySell, SellRowInfo
from app.schemas.users import UpdateUser

def test_valid_registration():
    entry = EntryRegistry(name="Ana Perez", email="ana@ejemplo.com", password="123456")
    assert entry.email == "ana@ejemplo.com"

def test_registration_rejects_invalid_email():
    with pytest.raises(ValidationError):
        EntryRegistry(name="Ana Perez", email="not-an-email", password="123456")

def test_registration_rejects_short_password():
    with pytest.raises(ValidationError):
        EntryRegistry(name="Ana Perez", email="ana@ejemplo.com", password="12345")

def test_registration_rejects_short_name():
    with pytest.raises(ValidationError):
        EntryRegistry(name="An", email="ana@ejemplo.com", password="123456")

def test_valid_login():
    entry = EntryLogin(email="ana@ejemplo.com", password="123456")
    assert entry.password == "123456"

def test_login_rejects_invalid_email():
    with pytest.raises(ValidationError):
        EntryLogin(email="ana@", password="123456")

def test_valid_course():
    entry = EntryCourse(
        course="React from scratch",
        subject="Web",
        instructor="Fabian",
        cost=150000,
        status="Activo",
    )
    assert entry.cost == 150000

def test_course_rejects_negative_cost():
    with pytest.raises(ValidationError):
        EntryCourse(
            course="React from scratch",
            subject="Web",
            instructor="Fabian",
            cost=-1,
            status="Activo",
        )

def test_course_rejects_short_name():
    with pytest.raises(ValidationError):
        EntryCourse(
            course="R",
            subject="Web",
            instructor="Fabian",
            cost=150000,
            status="Activo",
        )

def test_valid_sale():
    entry = EntrySell(
        clientName="Juan Client",
        clientIdentity="123456789",
        rows=[
            SellRowInfo(
                course="React from scratch",
                subject="Web",
                quantity=2,
                price=150000,
                total=300000,
            )
        ],
    )
    assert len(entry.rows) == 1

def test_sale_rejects_empty_rows():
    with pytest.raises(ValidationError):
        EntrySell(clientName="Juan Client", clientIdentity="123456789", rows=[])

def test_sale_rejects_quantity_below_one():
    with pytest.raises(ValidationError):
        EntrySell(
            clientName="Juan Client",
            clientIdentity="123456789",
            rows=[
                SellRowInfo(
                    course="React from scratch",
                    subject="Web",
                    quantity=0,
                    price=150000,
                    total=0,
                )
            ],
        )

def test_sale_rejects_negative_price():
    with pytest.raises(ValidationError):
        SellRowInfo(
            course="React from scratch",
            subject="Web",
            quantity=1,
            price=-100,
            total=-100,
        )

def test_sale_rejects_short_client_name():
    with pytest.raises(ValidationError):
        EntrySell(
            clientName="Ju",
            clientIdentity="123456789",
            rows=[
                SellRowInfo(
                    course="React from scratch",
                    subject="Web",
                    quantity=1,
                    price=150000,
                    total=150000,
                )
            ],
        )

def test_valid_role():
    assert EntryRole(name="Administrador").name == "Administrador"

def test_role_rejects_short_name():
    with pytest.raises(ValidationError):
        EntryRole(name="Ad")

def test_update_user_accepts_role_change():
    entry = UpdateUser(role="Vendedor")
    assert entry.role == "Vendedor"

def test_update_user_rejects_short_name():
    with pytest.raises(ValidationError):
        UpdateUser(name="An")
