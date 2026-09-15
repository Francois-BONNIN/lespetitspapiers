import { useState } from "react";
import { UserCheck, Trash2 } from "lucide-react";
import { Participant, Inclusion } from "../lib/database";

interface InclusionManagerProps {
  participants: Participant[];
  inclusions: Inclusion[];
  onAddInclusion: (participantId: string, includedId: string) => void;
  onDeleteInclusion: (id: string) => void;
}

export function InclusionManager({
  participants,
  inclusions,
  onAddInclusion,
  onDeleteInclusion,
}: InclusionManagerProps) {
  const [participantId, setParticipantId] = useState("");
  const [includedId, setIncludedId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (participantId && includedId && participantId !== includedId) {
      onAddInclusion(participantId, includedId);
      setParticipantId("");
      setIncludedId("");
    }
  };

  const getParticipantName = (id: string) => {
    return participants.find((p) => p.id === id)?.name || "Inconnu";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tirages Limités</h2>
      <p className="text-sm text-gray-600 mb-4">
        Définissez qui peut exclusivement tirer qui (restriction de tireurs
        possibles)
      </p>

      {participants.length < 2 ? (
        <p className="text-gray-500 text-center py-8">
          Ajoutez au moins 2 participants pour créer des restrictions
        </p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-3 items-center">
              <select
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionner...</option>
                {participants.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <span className="text-gray-600 font-medium">
                peut être tiré par
              </span>

              <select
                value={includedId}
                onChange={(e) => setIncludedId(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionner...</option>
                {participants
                  .filter((p) => p.id !== participantId)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
              </select>

              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <UserCheck size={20} />
                Ajouter
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {inclusions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Aucune restriction définie
              </p>
            ) : (
              inclusions.map((inclusion) => (
                <div
                  key={inclusion.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                >
                  <div className="flex items-center gap-3 text-gray-800">
                    <span className="font-medium">
                      {getParticipantName(inclusion.participant_id)}
                    </span>
                    <UserCheck size={16} className="text-green-600" />
                    <span className="font-medium">
                      {getParticipantName(inclusion.included_participant_id)}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteInclusion(inclusion.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {inclusions.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note :</strong> Si une personne a des restrictions
                définies, elle ne pourra être tirée QUE par les personnes
                spécifiées. Toutes les autres personnes seront automatiquement
                exclues de son tirage.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
