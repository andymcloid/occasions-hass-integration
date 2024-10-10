"""
    Occasions custom component - (c) Andreas Åhlfeldt
"""

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from .const import DOMAIN
import os
import shutil

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry):
    """Set up Occasions from a config entry."""
    ensure_frontend_files(hass)
    register_lovelace_module(hass)
    # Forward the setup to the sensor platform
    hass.async_create_task(
        hass.config_entries.async_forward_entry_setup(entry, "sensor")
    )
    return True



def ensure_frontend_files(hass):
    src = os.path.join(os.path.dirname(__file__), "occasions-card.js")
    dst_dir = os.path.join(hass.config.path("www/community/occasions/"))
    
    if not os.path.exists(dst_dir):
        os.makedirs(dst_dir)

    dst_file = os.path.join(dst_dir, "occasions-card.js")

    if not os.path.exists(dst_file):
        shutil.copyfile(src, dst_file)
        hass.components.logger.info("Occasions frontend files copied to: %s", dst_dir)



async def register_lovelace_module(hass):
    # Check if the resource is already added to Lovelace
    resources = await hass.helpers.storage.async_migrate(
        "lovelace_resources",
        1,
        lambda _: {"resources": []}
    )
    resource_url = "/hacsfiles/occasions/occasions-card.js"
    
    # If the resource is not already added, add it
    if not any(resource["url"] == resource_url for resource in resources["resources"]):
        await hass.services.async_call(
            "lovelace", "resources/add", {
                "url": resource_url,
                "res_type": "module"
            }
        )
        hass.components.logger.info(f"Added {resource_url} to Lovelace resources.")