"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { getOccupationStatusLabel } from "@/lib";
import { OccupationStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Transform OccupationStatus into an array
const occupationStatusArray = Object.values(
  OccupationStatus,
) as OccupationStatus[];

interface StatusSelectionProps {
  initialValue?: OccupationStatus;
}

export function StatusSelection({ initialValue }: StatusSelectionProps) {
  const [selectedStatus, setSelectedStatus] = useState<
    OccupationStatus | undefined
  >(initialValue);
  const router = useRouter();

  // Handle onChange event
  const handleChange = async (value: OccupationStatus) => {
    // const prevValue = selectedStatus;

    setSelectedStatus(value);
    return router.push(`/update-status?status=${value}`);

    // try {
    //   setLoading(true);
    //   setSelectedStatus(value);

    //   await updateUserAction({
    //     occupationStatus: value,
    //   });

    //   toast.success("Occupation status updated successfully!", {
    //     duration: 5000,
    //     position: "top-center",
    //     richColors: true,
    //     description: `Your occupation status is now set to ${getOccupationStatusLabel(
    //       value,
    //     )}.`,
    //   });
    // } catch (error) {
    //   toast.error("Failed to update occupation status.", {
    //     duration: 5000,
    //     position: "top-center",
    //     richColors: true,
    //     description: "Please try again later.",
    //   });
    //   console.log(error);
    //   setSelectedStatus(prevValue);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Select value={selectedStatus} onValueChange={handleChange}>
      <SelectTrigger className="w-full dark:text-black">
        <SelectValue className="dark:text-black" placeholder="Select a status">
          {selectedStatus
            ? getOccupationStatusLabel(selectedStatus)
            : "Select a status"}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Occupation Status</SelectLabel>
          {occupationStatusArray.map((status) => (
            <SelectItem key={status} value={status}>
              {getOccupationStatusLabel(status)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
