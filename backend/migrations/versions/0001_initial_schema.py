"""Initial database schema for Bhubaneswar AI Emergency Route Optimizer

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-09-09 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '0001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=120), nullable=False, unique=True, index=True),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=30), nullable=False, index=True),
        sa.Column('department', sa.String(length=100), nullable=True),
        sa.Column('is_active', sa.Boolean(), default=True, nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )

    # Stations table
    op.create_table(
        'stations',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('name', sa.String(length=120), nullable=False, index=True),
        sa.Column('type', sa.String(length=50), nullable=False),
        sa.Column('address', sa.String(length=255), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('contact_phone', sa.String(length=20), nullable=True),
        sa.Column('coverage_radius_km', sa.Float(), default=8.0),
        sa.Column('total_ambulances', sa.Integer(), default=4),
        sa.Column('available_ambulances', sa.Integer(), default=4),
        sa.Column('trauma_bays_total', sa.Integer(), default=5),
        sa.Column('trauma_bays_available', sa.Integer(), default=3),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )

    # Vehicles table
    op.create_table(
        'vehicles',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('vehicle_number', sa.String(length=50), nullable=False, unique=True, index=True),
        sa.Column('call_sign', sa.String(length=50), nullable=False, unique=True, index=True),
        sa.Column('type', sa.String(length=30), nullable=False, index=True),
        sa.Column('status', sa.String(length=30), nullable=False, index=True),
        sa.Column('driver_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('station_id', sa.String(length=36), sa.ForeignKey('stations.id', ondelete='SET NULL'), nullable=True),
        sa.Column('current_latitude', sa.Float(), nullable=False),
        sa.Column('current_longitude', sa.Float(), nullable=False),
        sa.Column('heading_deg', sa.Float(), default=0.0),
        sa.Column('speed_kmh', sa.Float(), default=0.0),
        sa.Column('fuel_level_percent', sa.Integer(), default=100),
        sa.Column('current_location_updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )

    # Emergencies table
    op.create_table(
        'emergencies',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('emergency_number', sa.String(length=30), nullable=False, unique=True, index=True),
        sa.Column('type', sa.String(length=30), nullable=False, index=True),
        sa.Column('priority', sa.String(length=30), nullable=False, index=True),
        sa.Column('status', sa.String(length=30), nullable=False, index=True),
        sa.Column('citizen_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('assigned_vehicle_id', sa.String(length=36), sa.ForeignKey('vehicles.id', ondelete='SET NULL'), nullable=True, index=True),
        sa.Column('destination_hospital_id', sa.String(length=36), sa.ForeignKey('stations.id', ondelete='SET NULL'), nullable=True, index=True),
        sa.Column('pickup_address', sa.String(length=255), nullable=False),
        sa.Column('pickup_landmark', sa.String(length=120), nullable=True),
        sa.Column('pickup_latitude', sa.Float(), nullable=False),
        sa.Column('pickup_longitude', sa.Float(), nullable=False),
        sa.Column('destination_name', sa.String(length=120), nullable=False),
        sa.Column('destination_address', sa.String(length=255), nullable=True),
        sa.Column('destination_latitude', sa.Float(), nullable=False),
        sa.Column('destination_longitude', sa.Float(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('patient_count', sa.Integer(), default=1),
        sa.Column('caller_name', sa.String(length=100), default='Citizen Caller'),
        sa.Column('caller_phone', sa.String(length=20), default='+91 108'),
        sa.Column('green_corridor_active', sa.Boolean(), default=False),
        sa.Column('eta_minutes', sa.Integer(), default=14),
        sa.Column('distance_remaining_km', sa.Float(), default=8.2),
        sa.Column('simulation_progress', sa.Integer(), default=0),
        sa.Column('triaged_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('assigned_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('accepted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('arriving_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('arrived_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('cancelled_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )

    # Incidents table
    op.create_table(
        'incidents',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('title', sa.String(length=150), nullable=False),
        sa.Column('type', sa.String(length=40), nullable=False, index=True),
        sa.Column('severity', sa.String(length=20), nullable=False, index=True),
        sa.Column('status', sa.String(length=20), nullable=False, index=True),
        sa.Column('latitude', sa.Float(), nullable=False),
        sa.Column('longitude', sa.Float(), nullable=False),
        sa.Column('address', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('delay_minutes', sa.Integer(), default=5),
        sa.Column('radius_meters', sa.Integer(), default=300),
        sa.Column('created_by_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('started_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )

    # Routes table
    op.create_table(
        'routes',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('emergency_id', sa.String(length=36), sa.ForeignKey('emergencies.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('route_name', sa.String(length=120), nullable=False),
        sa.Column('distance_km', sa.Float(), nullable=False),
        sa.Column('eta_minutes', sa.Integer(), nullable=False),
        sa.Column('time_saved_minutes', sa.Float(), default=0.0),
        sa.Column('traffic_level', sa.String(length=30), nullable=False),
        sa.Column('risk_score', sa.Float(), default=0.0),
        sa.Column('ai_score', sa.Float(), default=0.0, index=True),
        sa.Column('confidence_score', sa.Float(), default=0.9),
        sa.Column('is_recommended', sa.Boolean(), default=False, index=True),
        sa.Column('ai_explanation', sa.Text(), nullable=True),
        sa.Column('waypoints_json', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )

    # Route Events table
    op.create_table(
        'route_events',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('emergency_id', sa.String(length=36), sa.ForeignKey('emergencies.id', ondelete='CASCADE'), nullable=False, index=True),
        sa.Column('route_id', sa.String(length=36), sa.ForeignKey('routes.id', ondelete='SET NULL'), nullable=True),
        sa.Column('event_type', sa.String(length=50), nullable=False),
        sa.Column('reason', sa.String(length=255), nullable=False),
        sa.Column('old_eta_minutes', sa.Integer(), nullable=True),
        sa.Column('new_eta_minutes', sa.Integer(), nullable=True),
        sa.Column('triggered_by_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('details_json', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )

    # Notifications table
    op.create_table(
        'notifications',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=True, index=True),
        sa.Column('target_role', sa.String(length=50), nullable=True, index=True),
        sa.Column('emergency_id', sa.String(length=36), sa.ForeignKey('emergencies.id', ondelete='CASCADE'), nullable=True, index=True),
        sa.Column('title', sa.String(length=150), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('type', sa.String(length=50), default='info'),
        sa.Column('is_read', sa.Boolean(), default=False, index=True),
        sa.Column('read_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )

    # Audit Logs table
    op.create_table(
        'audit_logs',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True, index=True),
        sa.Column('action', sa.String(length=50), nullable=False, index=True),
        sa.Column('entity_type', sa.String(length=50), nullable=False, index=True),
        sa.Column('entity_id', sa.String(length=36), nullable=False, index=True),
        sa.Column('metadata_json', sa.Text(), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('audit_logs')
    op.drop_table('notifications')
    op.drop_table('route_events')
    op.drop_table('routes')
    op.drop_table('incidents')
    op.drop_table('emergencies')
    op.drop_table('vehicles')
    op.drop_table('stations')
    op.drop_table('users')
