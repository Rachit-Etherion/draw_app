"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_BACKEND_URL } from "@/config";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardBanner } from "./DashboardBanner";
import { RoomGrid } from "./RoomGrid";
import { CreateRoomModal } from "./CreateRoomModal";
import { RecentActivity } from "./RecentActivity";

/**
 * Frontend-only Dashboard (no backend calls)
 * - Pure presentational + local mock data
 * - Props allow parent to wire real data / handlers
 * - TailwindCSS for styling
 */

export function DashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false);
  const [rooms, setRooms] = useState<Array<{ id: string; slug: string; createdAt: string; admin: {name : string} }>>([]);

  // fallback mock data if parent doesn't provide rooms
  

  useEffect(() => {
    const roomsfetxh = async () => {
            const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
            return;
        }

        try {
            setIsAuthenticated(true);
            const data = await axios.get(`${HTTP_BACKEND_URL}/api/rooms`, {
                headers: {
                Authorization: `${token}`
            }
            });
            // console.log('Fetched rooms:', data);
            setRooms(data.data.rooms);

        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };
    roomsfetxh();

  },[]);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
    //   console.log('Verifying token:', token);
      
      if (!token) {
        router.push('/');
        return;
      }

      try {
        // Verify token with backend
        await axios.get(`${HTTP_BACKEND_URL}/api/verify`, {
          headers: {
            Authorization: `${token}`
          }
        });
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication failed:', error);
        localStorage.removeItem('token');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  const handleCreateRoom = async (roomName: string) => {
    // console.log('Creating room:', roomName);
    // Add your room creation logic here
    await axios.post(`${HTTP_BACKEND_URL}/room`, { name: roomName }, {
      headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
    });
    setCreateRoomModalOpen(false);
  };

  const handleJoinRoom = (roomId: string) => {
    // console.log('Joining room:', roomId);
    // Add your room join logic here
    router.push(`/canvas/${roomId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <DashboardHeader onCreateRoom={() => setCreateRoomModalOpen(true)} />

      {createRoomModalOpen && (
        <CreateRoomModal 
          onClose={() => setCreateRoomModalOpen(false)}
          onCreate={handleCreateRoom}
        />
      )}

      <main className="p-6">
        <section className="space-y-6">
          <DashboardBanner />
          <RoomGrid 
            rooms={rooms} 
            loading={loading} 
            onJoinRoom={handleJoinRoom} 
          />
          <RecentActivity />
        </section>
      </main>
    </div>
  );
}
