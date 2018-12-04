from typing import Optional, Tuple

import requests

from .types import ErrorMessage, Measurement, MeasurementResponse, URL


class Source:
    """Base class for metric sources."""

    TIMEOUT = 10  # Default timeout of 10 seconds

    @classmethod
    def metric(cls, url: URL, metric: str, component: str = None) -> MeasurementResponse:
        """Connect to the source to get and parse the measurement for the metric."""
        landing_url = cls.landing_url(url, metric, component or "")
        api_url = cls.api_url(url, metric, component or "")
        response, connection_error = cls.safely_get_source_response(api_url)
        measurement, parse_error = cls.safely_parse_source_response(metric, response) if response else (None, None)
        return dict(source=cls.name(), metric=metric, component=component, url=url, api_url=api_url, 
                    landing_url=landing_url, connection_error=connection_error, parse_error=parse_error, 
                    measurement=measurement)

    @classmethod
    def name(cls):
        return cls.__name__

    @classmethod
    def landing_url(cls, url: URL, metric: str, component: str) -> Optional[URL]: 
        """Translate the url into the landing url.""" 
        return None

    @classmethod
    def api_url(cls, url: URL, metric: str, component: str) -> URL: 
        """Translate the url into the API url.""" 
        return url

    @classmethod
    def safely_get_source_response(cls, url: URL) -> Tuple[Optional[requests.Response], Optional[ErrorMessage]]:
        """Connect to the source and get the data, without failing.""" 
        response, error = None, None
        try:
            response = cls.get_source_response(url)
        except Exception as reason:
            error = ErrorMessage(reason)
        return response, error

    @classmethod 
    def get_source_response(cls, url: URL) -> requests.Response:
        """Open the url. Raise an exception if the response status isn't 200 or if a time out occurs."""
        response = requests.get(url, timeout=cls.TIMEOUT)
        response.raise_for_status()
        return response

    @classmethod
    def safely_parse_source_response(cls, metric: str, response: requests.Response) -> Tuple[Optional[Measurement], 
                                                                                             Optional[ErrorMessage]]:
        """Parse to the measurement from the response, without failing.""" 
        measurement, error = None, None
        try:
            measurement = cls.parse_source_response(metric, response) 
        except Exception as reason:
            error = ErrorMessage(reason)
        return measurement, error

    @classmethod 
    def parse_source_response(cls, metric: str, response: requests.Response) -> Measurement:
        """Parse the response to get the measurement for the metric."""
        raise NotImplementedError