from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

def init_tracing(app):
    #identify the service
    resource = Resource.create({"service.name": "hr-pulse-backend"})
    #create a tracer provider
    provider = TracerProvider(resource=resource)
    #setup the exporter to send traces to the Jaeger container
    otlp_exporter = OTLPSpanExporter(endpoint="http://jaeger:4317", insecure=True)
    #process spans in batches for better performance
    processor = BatchSpanProcessor(otlp_exporter)
    provider.add_span_processor(processor)
    #set the provider globally
    trace.set_tracer_provider(provider)
    #automatically instrument FastAPI routes
    FastAPIInstrumentor.instrument_app(app)
