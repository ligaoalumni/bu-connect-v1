"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3,
  Calendar,
  Clock,
  Edit,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { PollDetail, Poll } from "@/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import dynamic from "next/dynamic";

const ClosePollModal = dynamic(() =>
  import("./close-modal").then((mod) => mod.ClosePollModal),
);

interface AdminPollDetailPageProps {
  poll: PollDetail;
}

export default function AdminPollDetailPage({
  poll,
}: AdminPollDetailPageProps) {
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes.length,
    0,
  );

  // Calculate engagement metrics
  const avgVotesPerDay =
    totalVotes /
    Math.max(
      1,
      Math.ceil(
        (Date.now() - poll.createdAt.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
  const topOption = poll.options.reduce((prev, current) =>
    prev.votes.length > current.votes.length ? prev : current,
  );

  const getStatusColor = (status: Poll["status"]) => {
    switch (status) {
      case "OPEN":
        return "bg-green-500 hover:bg-green-600";
      case "COMPLETED":
        return "bg-red-500 hover:bg-red-600";
      // case "DRAFT":
      //   return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusIcon = (status: Poll["status"]) => {
    switch (status) {
      case "OPEN":
        return <CheckCircle className="w-4 h-4" />;
      case "COMPLETED":
        return <XCircle className="w-4 h-4" />;
      // case "DRAFT":
      //   return <FileText className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Poll Details</h1>
            <p className="text-gray-600 mt-1">
              Administrative overview and analytics
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/polls/${poll.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
          </div>
        </div>

        {/* Poll Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{poll.question}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Created:{" "}
                      {formatDistanceToNow(poll.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <Badge className={`${getStatusColor(poll.status)} text-white`}>
                {getStatusIcon(poll.status)}
                <span className="ml-1">{poll.status}</span>
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Statistics Cards */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Votes
                  </p>
                  <p className="text-2xl font-bold">{totalVotes}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Avg. Votes/Day
                  </p>
                  <p className="text-2xl font-bold">
                    {avgVotesPerDay.toFixed(1)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Leading Option
                  </p>
                  <p className="text-lg font-bold truncate">
                    {topOption.content}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {topOption.votes.length} votes
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results and Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Poll Results & Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {poll.options.map((option, index) => {
                const voteCount = option.votes.length;
                const percentage =
                  totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                const isLeading = option.id === topOption.id;

                return (
                  <div key={option.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {option.content}
                            {isLeading && (
                              <Badge variant="secondary" className="text-xs">
                                Leading
                              </Badge>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{voteCount} votes</p>
                        <p className="text-sm text-muted-foreground">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-3" />
                    {index < poll.options.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>

            <Separator className="my-6" />

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Poll Metadata</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Poll ID:</span>
                    <span className="font-mono">#{poll.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Options:
                    </span>
                    <span>{poll.options.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Response Rate:
                    </span>
                    <span>{totalVotes > 0 ? "Active" : "No responses"}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Engagement Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Most Popular:</span>
                    <span>{topOption.content}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Least Popular:
                    </span>
                    <span>
                      {
                        poll.options.reduce((prev, current) =>
                          prev.votes.length < current.votes.length
                            ? prev
                            : current,
                        ).content
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days Active:</span>
                    <span>
                      {Math.ceil(
                        (Date.now() - poll.createdAt.getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Polls
          </Button>
          <div className="flex gap-2">
            {poll.status === "OPEN" && <ClosePollModal pollId={poll.id} />}
          </div>
        </div>
      </div>
    </div>
  );
}
