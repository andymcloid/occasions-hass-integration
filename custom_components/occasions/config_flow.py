"""
    Occasions custom component - (c) Andreas Åhlfeldt
"""

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import entity_registry
from homeassistant.const import CONF_NAME
import homeassistant.helpers.config_validation as cv
from datetime import datetime
from .const import DOMAIN  # Import your domain

class OccasionsConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Handle the initial step."""
        if user_input is not None:
            # Create an entry if user input exists
            return self.async_create_entry(
                title=user_input["name"],
                data=user_input
            )
        
       # Fetch the list of person entities to populate the person picker
        person_entities = await self._get_person_entities()

        # Define the schema for the form
        schema = vol.Schema({
            vol.Required("name", default="Occasion"): str,   # Name input as string
            vol.Required("date", default=datetime.now()): vol.Datetime,  # Date picker
            vol.Optional("person", default=None): vol.In(person_entities),  # Entity picker for person
            vol.Optional("icon", default="mdi:calendar"): vol.All(str, vol.Match(r'^mdi:.+')),  # Icon input with validation
        })

        # Show the form for user input
        return self.async_show_form(
            step_id="user",
            data_schema=schema
        )
    

    @callback
    async def _get_person_entities(self):
        """Get a list of person entities."""
        # Get all entity ids of type 'person'
        entity_reg = await self.hass.helpers.entity_registry.async_get_registry()
        return [entity.entity_id for entity in entity_reg.entities.values() if entity.entity_id.startswith("person.")]