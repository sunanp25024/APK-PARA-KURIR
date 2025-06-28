"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Users, Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import type { UserProfile } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userDataString = localStorage.getItem('loggedInUser');
    if (userDataString) {
      try {
        setCurrentUser(JSON.parse(userDataString) as UserProfile);
      } catch (error) {
        console.error("Error parsing user data for dashboard", error);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 17) return "Selamat Siang";
    return "Selamat Malam";
  };

  const getRoleSpecificContent = () => {
    switch (currentUser?.role) {
      case 'MasterAdmin':
        return {
          title: "Dashboard MasterAdmin",
          description: "Kelola seluruh sistem dan persetujuan",
          stats: [
            { title: "Total Admin", value: "12", icon: Users, color: "text-blue-500" },
            { title: "Total PIC", value: "8", icon: Users, color: "text-green-500" },
            { title: "Total Kurir", value: "45", icon: Users, color: "text-purple-500" },
            { title: "Pending Approval", value: "3", icon: Clock, color: "text-orange-500" },
          ]
        };
      case 'Admin':
        return {
          title: "Dashboard Admin",
          description: "Kelola PIC dan Kurir",
          stats: [
            { title: "PIC Aktif", value: "8", icon: Users, color: "text-green-500" },
            { title: "Kurir Aktif", value: "42", icon: Users, color: "text-purple-500" },
            { title: "Status Approval", value: "2", icon: Clock, color: "text-orange-500" },
            { title: "Laporan Hari Ini", value: "15", icon: Package, color: "text-blue-500" },
          ]
        };
      case 'PIC':
        return {
          title: "Dashboard PIC",
          description: "Monitor kurir dan laporan",
          stats: [
            { title: "Kurir Aktif", value: "12", icon: Users, color: "text-green-500" },
            { title: "Paket Hari Ini", value: "156", icon: Package, color: "text-blue-500" },
            { title: "Terkirim", value: "142", icon: CheckCircle, color: "text-green-500" },
            { title: "Rate Sukses", value: "91%", icon: TrendingUp, color: "text-purple-500" },
          ]
        };
      case 'Kurir':
        return {
          title: "Dashboard Kurir",
          description: "Pantau performa dan tugas harian",
          stats: [
            { title: "Paket Hari Ini", value: "24", icon: Package, color: "text-blue-500" },
            { title: "Terkirim", value: "22", icon: CheckCircle, color: "text-green-500" },
            { title: "Pending", value: "2", icon: Clock, color: "text-orange-500" },
            { title: "Rate Sukses", value: "92%", icon: TrendingUp, color: "text-purple-500" },
          ]
        };
      default:
        return {
          title: "Dashboard",
          description: "Selamat datang di sistem",
          stats: []
        };
    }
  };

  const content = getRoleSpecificContent();

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <LayoutDashboard className="mr-3 h-7 w-7" />
            {getGreeting()}, {currentUser?.fullName}!
          </CardTitle>
          <CardDescription className="text-lg">
            {content.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {content.stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Akses Cepat</CardTitle>
          <CardDescription>Fitur yang tersedia untuk peran Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentUser?.role === 'MasterAdmin' && (
              <>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Manage Admin</h3>
                      <p className="text-sm text-muted-foreground">Kelola akun Admin</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Persetujuan</h3>
                      <p className="text-sm text-muted-foreground">Review permintaan</p>
                    </div>
                  </div>
                </Card>
              </>
            )}
            
            {(currentUser?.role === 'Admin' || currentUser?.role === 'MasterAdmin') && (
              <>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Manage PIC</h3>
                      <p className="text-sm text-muted-foreground">Kelola akun PIC</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Manage Kurir</h3>
                      <p className="text-sm text-muted-foreground">Kelola akun Kurir</p>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {currentUser?.role === 'PIC' && (
              <>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Manajemen Kurir</h3>
                      <p className="text-sm text-muted-foreground">Monitor kurir</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Package className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Laporan</h3>
                      <p className="text-sm text-muted-foreground">Download laporan</p>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {currentUser?.role === 'Kurir' && (
              <>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Absensi</h3>
                      <p className="text-sm text-muted-foreground">Check-in/out harian</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Performa</h3>
                      <p className="text-sm text-muted-foreground">Lihat statistik</p>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}