'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Trash2, Clock, Music, Copy, Download, Upload, Search, Filter, Grid3X3, List } from 'lucide-react'
import Link from 'next/link'

interface Song {
  id: string
  title: string
  artist: string
  duration: number // in seconds
  key?: string
  tempo?: number
  notes?: string
}

interface Setlist {
  id: string
  name: string
  date: string
  venue: string
  songs: Song[]
  notes?: string
}

export default function SetlistBuilder() {
  const [setlists, setSetlists] = useState<Setlist[]>([])
  const [currentSetlist, setCurrentSetlist] = useState<Setlist | null>(null)
  const [songLibrary, setSongLibrary] = useState<Song[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [isAddingSong, setIsAddingSong] = useState(false)
  const [newSong, setNewSong] = useState<Partial<Song>>({
    title: '',
    artist: '',
    duration: 180,
    key: '',
    tempo: 120
  })

  useEffect(() => {
    // Load from localStorage
    const savedSetlists = localStorage.getItem('musicSetlists')
    const savedLibrary = localStorage.getItem('songLibrary')
    
    if (savedSetlists) setSetlists(JSON.parse(savedSetlists))
    if (savedLibrary) setSongLibrary(JSON.parse(savedLibrary))
  }, [])

  const saveToLocalStorage = (lists: Setlist[], library: Song[]) => {
    localStorage.setItem('musicSetlists', JSON.stringify(lists))
    localStorage.setItem('songLibrary', JSON.stringify(library))
  }

  const createNewSetlist = () => {
    const newSetlist: Setlist = {
      id: Date.now().toString(),
      name: `Setlist ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString().split('T')[0],
      venue: '',
      songs: []
    }
    setCurrentSetlist(newSetlist)
  }

  const saveSetlist = () => {
    if (!currentSetlist) return

    const updatedSetlists = currentSetlist.id && setlists.find(s => s.id === currentSetlist.id)
      ? setlists.map(s => s.id === currentSetlist.id ? currentSetlist : s)
      : [...setlists, currentSetlist]

    setSetlists(updatedSetlists)
    saveToLocalStorage(updatedSetlists, songLibrary)
  }

  const addSongToLibrary = () => {
    if (!newSong.title || !newSong.artist) return

    const song: Song = {
      id: Date.now().toString(),
      title: newSong.title,
      artist: newSong.artist,
      duration: newSong.duration || 180,
      key: newSong.key,
      tempo: newSong.tempo,
      notes: newSong.notes
    }

    const updatedLibrary = [...songLibrary, song]
    setSongLibrary(updatedLibrary)
    saveToLocalStorage(setlists, updatedLibrary)
    
    setNewSong({
      title: '',
      artist: '',
      duration: 180,
      key: '',
      tempo: 120
    })
    setIsAddingSong(false)
  }

  const addSongToSetlist = (song: Song) => {
    if (!currentSetlist) return

    const updatedSetlist = {
      ...currentSetlist,
      songs: [...currentSetlist.songs, song]
    }
    setCurrentSetlist(updatedSetlist)
  }

  const removeSongFromSetlist = (songId: string) => {
    if (!currentSetlist) return

    const updatedSetlist = {
      ...currentSetlist,
      songs: currentSetlist.songs.filter(s => s.id !== songId)
    }
    setCurrentSetlist(updatedSetlist)
  }

  const moveSong = (index: number, direction: 'up' | 'down') => {
    if (!currentSetlist) return

    const newSongs = [...currentSetlist.songs]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex >= 0 && newIndex < newSongs.length) {
      [newSongs[index], newSongs[newIndex]] = [newSongs[newIndex], newSongs[index]]
      setCurrentSetlist({ ...currentSetlist, songs: newSongs })
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTotalDuration = () => {
    if (!currentSetlist) return '0:00'
    const total = currentSetlist.songs.reduce((sum, song) => sum + song.duration, 0)
    return formatDuration(total)
  }

  const exportSetlist = () => {
    if (!currentSetlist) return

    const content = `${currentSetlist.name}
Date: ${currentSetlist.date}
Venue: ${currentSetlist.venue}
Total Duration: ${getTotalDuration()}

SETLIST:
${currentSetlist.songs.map((song, index) => 
  `${index + 1}. ${song.title} - ${song.artist} (${formatDuration(song.duration)})${song.key ? ` - Key: ${song.key}` : ''}${song.tempo ? ` - ${song.tempo} BPM` : ''}`
).join('\n')}

${currentSetlist.notes ? `\nNOTES:\n${currentSetlist.notes}` : ''}`

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentSetlist.name.replace(/\s+/g, '_')}_setlist.txt`
    a.click()
  }

  const filteredSongs = songLibrary.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/tools" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tools
        </Link>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <Music className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Setlist Builder</h1>
              <p className="text-gray-600 mt-1">Create and manage performance setlists</p>
            </div>
          </div>

          {!currentSetlist ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Setlists</h2>
                <button
                  onClick={createNewSetlist}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Setlist
                </button>
              </div>

              {setlists.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No setlists yet. Create your first one!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {setlists.map(setlist => (
                    <div
                      key={setlist.id}
                      onClick={() => setCurrentSetlist(setlist)}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <h3 className="font-semibold text-gray-900">{setlist.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{setlist.venue || 'No venue'}</p>
                      <p className="text-sm text-gray-500">{new Date(setlist.date).toLocaleDateString()}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm text-gray-600">{setlist.songs.length} songs</span>
                        <span className="text-sm text-purple-600">
                          {formatDuration(setlist.songs.reduce((sum, s) => sum + s.duration, 0))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <input
                    type="text"
                    value={currentSetlist.name}
                    onChange={(e) => setCurrentSetlist({ ...currentSetlist, name: e.target.value })}
                    className="text-2xl font-bold bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-purple-600 outline-none transition-colors"
                  />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input
                      type="text"
                      placeholder="Venue"
                      value={currentSetlist.venue}
                      onChange={(e) => setCurrentSetlist({ ...currentSetlist, venue: e.target.value })}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <input
                      type="date"
                      value={currentSetlist.date}
                      onChange={(e) => setCurrentSetlist({ ...currentSetlist, date: e.target.value })}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={exportSetlist}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Export setlist"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={saveSetlist}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setCurrentSetlist(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Current Setlist</h3>
                    <div className="flex items-center text-purple-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="font-medium">{getTotalDuration()}</span>
                    </div>
                  </div>

                  {currentSetlist.songs.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">No songs in setlist. Add from library →</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentSetlist.songs.map((song, index) => (
                        <div key={song.id} className="flex items-center p-3 bg-gray-50 rounded-lg group">
                          <span className="text-gray-500 mr-3 font-medium">{index + 1}</span>
                          <div className="flex-1">
                            <p className="font-medium">{song.title}</p>
                            <p className="text-sm text-gray-600">{song.artist}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            {song.key && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Key: {song.key}</span>}
                            <span className="text-sm text-gray-600">{formatDuration(song.duration)}</span>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <button
                                onClick={() => moveSong(index, 'up')}
                                disabled={index === 0}
                                className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => moveSong(index, 'down')}
                                disabled={index === currentSetlist.songs.length - 1}
                                className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                              >
                                ↓
                              </button>
                              <button
                                onClick={() => removeSongFromSetlist(song.id)}
                                className="p-1 hover:bg-red-100 rounded text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <textarea
                    placeholder="Notes for this setlist..."
                    value={currentSetlist.notes || ''}
                    onChange={(e) => setCurrentSetlist({ ...currentSetlist, notes: e.target.value })}
                    className="w-full mt-4 p-3 border rounded-lg resize-none h-24 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Song Library</h3>
                    <button
                      onClick={() => setIsAddingSong(true)}
                      className="text-purple-600 hover:text-purple-700 flex items-center text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Song
                    </button>
                  </div>

                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search songs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  {isAddingSong && (
                    <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium mb-3">Add New Song</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Song title"
                          value={newSong.title}
                          onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Artist"
                          value={newSong.artist}
                          onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs text-gray-600">Duration (sec)</label>
                            <input
                              type="number"
                              value={newSong.duration}
                              onChange={(e) => setNewSong({ ...newSong, duration: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600">Key</label>
                            <input
                              type="text"
                              placeholder="C, Am, etc"
                              value={newSong.key}
                              onChange={(e) => setNewSong({ ...newSong, key: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-600">Tempo (BPM)</label>
                            <input
                              type="number"
                              value={newSong.tempo}
                              onChange={(e) => setNewSong({ ...newSong, tempo: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={addSongToLibrary}
                            disabled={!newSong.title || !newSong.artist}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                          >
                            Add to Library
                          </button>
                          <button
                            onClick={() => setIsAddingSong(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredSongs.map(song => (
                      <div
                        key={song.id}
                        onClick={() => addSongToSetlist(song)}
                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <p className="font-medium">{song.title}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">{song.artist}</p>
                          <span className="text-sm text-gray-500">{formatDuration(song.duration)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}