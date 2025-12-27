from datetime import datetime
import pytz

def get_current_time():
    """Returns current UTC time"""
    return datetime.now(pytz.utc)

def format_date(dt: datetime):
    """Formats datetime to ISO string"""
    if dt:
        return dt.isoformat()
    return None
