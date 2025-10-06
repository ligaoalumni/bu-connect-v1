"use client";

import { useEffect, useState } from "react";
import { Gallery } from "./__components/gallery";
import { SearchBar } from "./__components/search-bar";
import { readBatchesAction } from "@/actions";
import { Batch } from "@/types";
import { Button } from "@/components";
import { Plus, RefreshCw } from "lucide-react";
import { AddBatchDialog } from "./__components/add-batch-dialog";

export default function BatchesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [batches, setBatches] = useState<Batch[]>([]);
  const [addBatchOpen, setAddBatchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter batches based on search term
  const filteredBatches = batches.filter((batch) => {
    if (!searchTerm) return true;
    return batch.batch.toString().includes(searchTerm);
  });

  async function fetchBatches() {
    setIsLoading(true);
    setError(null);

    try {
      const data = await readBatchesAction();
      setBatches(data.data);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setError("Failed to load batches. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBatches();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="w-full flex items-center justify-between">
        <div className="max-w-md">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Search by batch number..."
          />
        </div>
        <Button onClick={() => setAddBatchOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Batch
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="animate-spin mb-4">
            <RefreshCw className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Loading batches...</h3>
          <p className="text-muted-foreground">
            Please wait while we fetch your batches
          </p>
        </div>
      ) : error ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-lg border border-dashed border-destructive p-8 text-center">
          <h3 className="text-lg font-medium text-destructive">
            Error loading batches
          </h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchBatches} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      ) : filteredBatches.length > 0 ? (
        <Gallery setBatches={setBatches} batches={filteredBatches} />
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No batches found</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? `No batches match your search for "${searchTerm}"`
              : "No batches available. Add your first batch to get started."}
          </p>
        </div>
      )}

      <AddBatchDialog
        open={addBatchOpen}
        onOpenChange={setAddBatchOpen}
        setBatches={setBatches}
      />
    </div>
  );
}
