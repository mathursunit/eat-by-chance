import React from 'react';
import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { getRestaurantStatus } from '../utils/time';

export function RestaurantCard({ restaurant, index, className = '' }) {
    const { isOpen, text } = getRestaurantStatus(restaurant);

    return (
        <div className={`restaurant-card ${className}`}>
            <div className="card-header">
                <h3 className="card-title">
                    <span style={{ color: '#f43f5e', marginRight: '0.5rem' }}>#{index}</span>
                    {restaurant.name}
                </h3>
                <span className={`status-badge ${isOpen ? 'status-open' : 'status-closed'}`}>
                    {text}
                </span>
            </div>

            <p className="card-desc">{restaurant.description}</p>

            <div className="card-footer">
                <div className="card-info">
                    <MapPin size={16} className="icon-subtle" />
                    <span>{restaurant.address}</span>
                    {restaurant.distance !== undefined && (
                        <span className="distance-tag" style={{ marginLeft: 'auto', background: '#1e293b', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', border: '1px solid #334155' }}>
                            {restaurant.distance.toFixed(1)} mi
                        </span>
                    )}
                </div>

                <a
                    href={restaurant.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-link"
                >
                    View on Map <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
}
