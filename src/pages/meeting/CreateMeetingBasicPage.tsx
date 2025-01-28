import React, { useState } from "react";
import DurationModal from "../../components/meeting/modals/DurationModal";
import ParticipantsModal from "../../components/meeting/modals/ParticipantsModal";
import { DURATION } from "../../types/models/meeting";

const CreateMeetingBasicPage = () => {
  const [isDurationModalOpen, setIsDurationModalOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<DURATION>();
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(true);
  const [selectedParticipants, setSelectedParticipants] = useState<number>(1);

  return (
    <div className="flex flex-col w-full bg-background px-48 py-24">
      <DurationModal
        isOpen={isDurationModalOpen}
        onClose={() => setIsDurationModalOpen(false)}
        onSelect={setSelectedDuration}
        selectedDuration={selectedDuration}
      />

      <ParticipantsModal
        isOpen={isParticipantsModalOpen}
        onClose={() => setIsParticipantsModalOpen(false)}
        onSelect={setSelectedParticipants}
        selectedParticipants={selectedParticipants}
      />
    </div>
  );
};

export default CreateMeetingBasicPage;