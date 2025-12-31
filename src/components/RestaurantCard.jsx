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
