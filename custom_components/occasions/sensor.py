"""
    Occasions custom component - (c) Andreas Åhlfeldt
"""

from homeassistant.helpers.entity import Entity
from .const import DOMAIN

async def async_setup_entry(hass, entry, async_add_entities):
    """Set up the sensor entity from a config entry."""
    name = entry.data["name"]
    date = entry.data["date"]
    icon = entry.data.get("icon", "mdi:calendar")
    person = entry.data.get("person", None)

    # Add a sensor entity
    async_add_entities([OccasionSensor(name, date, icon, person)], True)

class OccasionSensor(Entity):
    """Representation of an occasion sensor."""

    def __init__(self, name, date, icon, person):
        """Initialize the sensor."""
        self._name = f"sensor.occasion_{name.lower().replace(' ', '_')}"
        self._state = self.calculate_next_occurrence(date)
        self._icon = icon
        self._attributes = {
            "remaining_days": self.calculate_remaining_days(date),
            "person": person
        }

    @property
    def name(self):
        return self._name

    @property
    def state(self):
        return self._state

    @property
    def icon(self):
        return self._icon

    @property
    def extra_state_attributes(self):
        return self._attributes

    def calculate_next_occurrence(self, date):
        # Logic to calculate the next occurrence
        return date

    def calculate_remaining_days(self, date):
        # Logic to calculate remaining days until the occasion
        return 5
