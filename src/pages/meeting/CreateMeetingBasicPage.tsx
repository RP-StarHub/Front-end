import React, { useState } from "react";
import DurationModal from "../../components/meeting/modals/DurationModal";
import { DURATION } from "../../types/models/meeting";

const CreateMeetingBasicPage = () => {
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState<DURATION>();

  return (
    <div className="flex flex-col w-full bg-background px-48 py-24">
      <DurationModal
        isOpen={isDurationModalOpen}
        onClose={() => setIsDurationModalOpen(false)}
        onSelect={setSelectedDuration}
        selectedDuration={selectedDuration}
      />
    </div>
  );
};

export default CreateMeetingBasicPage;