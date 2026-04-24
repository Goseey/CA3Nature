'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)
const Circle = dynamic(
  () => import('react-leaflet').then(mod => mod.Circle),
  { ssr: false }
)
const Polyline = dynamic(
  () => import('react-leaflet').then(mod => mod.Polyline),
  { ssr: false }
)
import { useMap } from 'react-leaflet'

interface Location {
  id: number
  name: string
  description: string | null
  latitude: number
  longitude: number
  campus: string
}

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

export default function MapPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [filter, setFilter] = useState<string>('All')
  const [selectedCampus, setSelectedCampus] = useState<string>('All')
  const [showNearby, setShowNearby] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([53.3498, -6.2603])
  const [mapZoom, setMapZoom] = useState(16)

  useEffect(() => {
    loadLocations()
    getUserLocation()
    setMapReady(true)
  }, [])

  const loadLocations = async () => {
    const { data } = await supabase
      .from('locations')
      .select('*')
      .order('campus', { ascending: true })
      .order('name', { ascending: true })
    
    if (data) setLocations(data)
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Location access denied')
        }
      )
    }
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const categories = ['All', 'Study', 'Academic', 'Services', 'Food', 'Sports']
  const campuses = ['All', 'Grangegorman', 'Tallaght', 'Blanchardstown', 'Bolton Street', 'Aungier Street']
  
  const campusCoordinates: {[key: string]: [number, number]} = {
    'All': [53.3498, -6.2603],
    'Grangegorman': [53.3498, -6.2603],
    'Tallaght': [53.2866, -6.3733],
    'Blanchardstown': [53.3928, -6.3867],
    'Bolton Street': [53.3532, -6.2655],
    'Aungier Street': [53.3359, -6.2636]
  }

  const getCategoryFromDescription = (desc: string | null): string => {
    if (!desc) return 'Other'
    const lower = desc.toLowerCase()
    if (lower.includes('library') || lower.includes('study')) return 'Study'
    if (lower.includes('lab') || lower.includes('lecture') || lower.includes('cs ')) return 'Academic'
    if (lower.includes('student') || lower.includes('services') || lower.includes('medical')) return 'Services'
    if (lower.includes('cafeteria') || lower.includes('food') || lower.includes('cafe') || lower.includes('canteen')) return 'Food'
    if (lower.includes('sport') || lower.includes('gym')) return 'Sports'
    return 'Other'
  }

  const filteredLocations = locations.filter(loc => {
    const categoryMatch = filter === 'All' || getCategoryFromDescription(loc.description) === filter
    const campusMatch = selectedCampus === 'All' || loc.campus === selectedCampus
    
    if (showNearby && userLocation) {
      const distance = calculateDistance(userLocation.lat, userLocation.lng, loc.latitude, loc.longitude)
      return categoryMatch && campusMatch && distance <= 0.5
    }
    
    return categoryMatch && campusMatch
  })

  const locationsWithDistance = filteredLocations.map(loc => ({
    ...loc,
    distance: userLocation 
      ? calculateDistance(userLocation.lat, userLocation.lng, loc.latitude, loc.longitude)
      : null
  })).sort((a, b) => {
    if (!a.distance || !b.distance) return 0
    return a.distance - b.distance
  })

  const getCategoryColor = (category: string): string => {
    const colors: {[key: string]: string} = {
      'Study': '#3B82F6',
      'Academic': '#10B981',
      'Services': '#8B5CF6',
      'Food': '#F59E0B',
      'Sports': '#EF4444'
    }
    return colors[category] || '#6B7280'
  }

  const getCategoryIcon = (category: string): string => {
    const icons: {[key: string]: string} = {
      'Study': '📚',
      'Academic': '💻',
      'Services': '🏛️',
      'Food': '🍽️',
      'Sports': '🏃'
    }
    return icons[category] || '📍'
  }

  const handleCampusChange = (campus: string) => {
    setSelectedCampus(campus)
    setSelectedLocation(null)
    setMapCenter(campusCoordinates[campus])
    setMapZoom(campus === 'All' ? 12 : 16)
  }

  const handleLocationClick = (loc: Location) => {
    setSelectedLocation(loc)
    setMapCenter([loc.latitude, loc.longitude])
    setMapZoom(17)
  }

  const getRouteUrl = (loc: Location) => {
    if (!userLocation) return '#'
    return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${loc.latitude},${loc.longitude}&travelmode=walking`
  }

  return (
    <div style={{ background: 'var(--surface-1)', minHeight: 'calc(100vh - 64px)' }}>
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '64px' }}>
        <div style={{ 
          display: 'inline-block',
          background: 'var(--brand-green)',
          color: 'white',
          padding: '6px 16px',
          borderRadius: '20px',
          marginBottom: '16px',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          🗺️ Campus Map
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '2.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '12px'
        }}>
          Navigate Campus
        </h1>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '24px' }}>
          Find your way around TUD — all campuses, classrooms, library, cafeteria, and more.
        </p>

        {/* Campus Selector */}
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
            Select Campus
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {campuses.map(campus => (
              <button
                key={campus}
                onClick={() => handleCampusChange(campus)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: selectedCampus === campus ? '2px solid var(--brand-blue)' : '1px solid var(--border)',
                  background: selectedCampus === campus ? 'var(--brand-blue)' : 'white',
                  color: selectedCampus === campus ? 'white' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                {campus}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: filter === cat ? '2px solid var(--brand-blue)' : '1px solid var(--border)',
                background: filter === cat ? 'var(--brand-blue-pale)' : 'white',
                color: filter === cat ? 'var(--brand-blue)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
          
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setShowNearby(!showNearby)}
              disabled={!userLocation}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: showNearby ? '2px solid #10B981' : '1px solid var(--border)',
                background: showNearby ? '#D1FAE5' : 'white',
                color: showNearby ? '#065F46' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: userLocation ? 'pointer' : 'not-allowed',
                opacity: userLocation ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              📍 Near me {showNearby && '(500m)'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
          {/* Map */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            height: '600px'
          }}>
            {mapReady && (
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
              >
                <MapController center={mapCenter} zoom={mapZoom} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {userLocation && (
                  <Circle
                    center={[userLocation.lat, userLocation.lng]}
                    radius={20}
                    pathOptions={{ color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.5 }}
                  />
                )}

                {filteredLocations.map(loc => (
                  <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                    <Popup>
                      <div style={{ padding: '8px' }}>
                        <h3 style={{ margin: '0 0 4px 0', fontWeight: 700 }}>{loc.name}</h3>
                        <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#666' }}>
                          {loc.description}
                        </p>
                        <button
                          onClick={() => handleLocationClick(loc)}
                          style={{
                            padding: '6px 12px',
                            background: 'var(--brand-blue)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Select
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {selectedLocation && userLocation && (
                  <Polyline
                    positions={[
                      [userLocation.lat, userLocation.lng],
                      [selectedLocation.latitude, selectedLocation.longitude]
                    ]}
                    pathOptions={{ color: '#3B82F6', weight: 3, dashArray: '10, 10' }}
                  />
                )}
              </MapContainer>
            )}
          </div>

          {/* Location List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '600px',
            overflowY: 'auto'
          }}>
            <h3 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '1.2rem',
              marginBottom: '8px'
            }}>
              {locationsWithDistance.length} location{locationsWithDistance.length !== 1 ? 's' : ''}
              {showNearby && ' near you'}
            </h3>

            {locationsWithDistance.map(loc => {
              const category = getCategoryFromDescription(loc.description)
              const isSelected = selectedLocation?.id === loc.id
              
              return (
                <div
                  key={loc.id}
                  onClick={() => handleLocationClick(loc)}
                  style={{
                    background: isSelected ? 'var(--brand-blue-pale)' : 'white',
                    borderRadius: '10px',
                    padding: '16px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    border: isSelected ? '2px solid var(--brand-blue)' : '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: getCategoryColor(category) + '20',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      flexShrink: 0
                    }}>
                      {getCategoryIcon(category)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
                        <h4 style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          margin: 0,
                          color: 'var(--text-primary)'
                        }}>
                          {loc.name}
                        </h4>
                        {loc.distance !== null && (
                          <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            fontWeight: 600,
                            flexShrink: 0,
                            marginLeft: '8px'
                          }}>
                            {loc.distance < 1 
                              ? `${Math.round(loc.distance * 1000)}m`
                              : `${loc.distance.toFixed(1)}km`
                            }
                          </span>
                        )}
                      </div>
                      
                      <p style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        margin: '0 0 6px 0',
                        lineHeight: '1.4'
                      }}>
                        {loc.description}
                      </p>

                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          background: getCategoryColor(category) + '15',
                          color: getCategoryColor(category)
                        }}>
                          {category}
                        </span>
                        <span style={{
                          fontSize: '0.7rem',
                          color: 'var(--text-muted)'
                        }}>
                          {loc.campus}
                        </span>
                      </div>

                      {isSelected && userLocation && (
                        <a
                          href={getRouteUrl(loc)}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-block',
                            marginTop: '8px',
                            padding: '6px 12px',
                            background: 'var(--brand-blue)',
                            color: 'white',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            textDecoration: 'none'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          🚶 Get Directions
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
    </div>
  )
}