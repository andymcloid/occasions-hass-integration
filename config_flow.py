"""
    Occasions custom component - (c) Andreas Åhlfeldt
"""

import voluptuous as vol
from homeassistant import config_entries
from .const import DOMAIN

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

        # Show the form for user input
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required("name"): str,
                vol.Required("date"): str,
                vol.Optional("icon"): str,
                vol.Optional("person"): str,
            })
        )
