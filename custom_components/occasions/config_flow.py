import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import entity_registry
import homeassistant.helpers.config_validation as cv
from datetime import datetime

from .const import DOMAIN  # Import your domain

class OccasionsConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1
    CONNECTION_CLASS = config_entries.CONN_CLASS_LOCAL_PUSH

    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        if user_input is not None:
            return self.async_create_entry(title=user_input["name"], data=user_input)

        # Fetch the list of person entities for the entity picker
        person_entities = await self._get_person_entities()

        # Define the schema for the form
        schema = vol.Schema({
            vol.Required("name", default="My Occasion"): str,   # Name input
            vol.Required("date", default=datetime.now()): vol.Datetime,  # Date picker
            vol.Optional("person", default=None): vol.In(person_entities),  # Entity picker for person entities
            vol.Optional("icon", default="mdi:calendar"): vol.All(str, vol.Match(r'^mdi:.+')),  # Icon input with validation
        })

        return self.async_show_form(
            step_id="user",
            data_schema=schema
        )

    @callback
    async def _get_person_entities(self):
        """Get a list of person entities."""
        entity_reg = entity_registry.async_get(self.hass)
        return [entity.entity_id for entity in entity_reg.entities.values() if entity.entity_id.startswith("person.")]
