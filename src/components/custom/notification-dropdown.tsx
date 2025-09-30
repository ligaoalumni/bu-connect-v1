"use client";

import { useEffect, useState } from "react";
import { Bell, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, getNotificationTitle, createBrowserClient } from "@/lib";
import { useAuth } from "@/contexts";
import { Notification } from "@prisma/client";
import {
  readNotificationsAction,
  updateAllNotificationStatusAction,
  updateNotificationStatusAction,
} from "@/actions";
import { formatDistanceToNow, isAfter, min, sub } from "date-fns";
import Link from "next/link";

interface NotificationDropdownProps {
  className?: string;
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const { user, setNotifications, notifications } = useAuth();
  const unreadCount = notifications.filter(
    (notification) => !notification.readStatus,
  ).length;

  const handleNotificationClick = async (id: number) => {
    await updateNotificationStatusAction(id);
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => {
        if (notification.id === id) {
          return { ...notification, readStatus: true };
        }
        return notification;
      }),
    );
    setOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await updateAllNotificationStatusAction();
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        readStatus: true,
      })),
    );
    // setOpen(false);
  };

  useEffect(() => {
    const db = createBrowserClient();
    const subscription = db
      .channel("notifications_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `userId=eq.${Number(user?.id)}`,
        },
        async (payload) => {
          if (user && payload.new) {
            setNotifications((prevNotifications) => {
              return [
                { ...payload.new, createdAt: new Date() } as Notification,
                ...prevNotifications,
              ];
            });
          }
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const notifications = await readNotificationsAction();
        setNotifications(notifications);
      } catch (error) {
        setNotifications([]);
        console.error("Error fetching notifications:", error);
      }
    }

    fetchNotifications();
  }, [user?.id]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("relative h-9 w-9 rounded-full", className)}
          onClick={handleMarkAllAsRead}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <>
              <Badge className="absolute bg-destructive -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {unreadCount}
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs h-8"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.link || "#"}
                  className={cn(
                    "flex flex-col gap-2 p-4 border-b last:border-0 cursor-pointer transition-colors relative",
                    notification.readStatus
                      ? "hover:bg-muted"
                      : "bg-muted/30 hover:bg-muted/50 border-l-4 border-l-primary",
                  )}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">
                            {getNotificationTitle(notification.type)}
                          </h4>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.readStatus && (
                      <Circle className="h-2 w-2 fill-primary text-primary" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(notification.createdAt, {
                      addSuffix: true,
                    })}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              No notifications
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
