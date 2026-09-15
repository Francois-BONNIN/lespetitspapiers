import { useState } from "react";
import { Ban, Trash2, Users } from "lucide-react";
import { Participant, Exclusion } from "../lib/database";

interface ExclusionManagerProps {
  participants: Participant[];
  exclusions: Exclusion[];
  onAddExclusion: (participantId: string, excludedId: string) => void;
  onDeleteExclusion: (id: string) => void;
  excludeSameFamily: boolean;
  onToggleExcludeSameFamily: () => void;
}

export function ExclusionManager({
  participants,
  exclusions,
  onAddExclusion,
  onDeleteExclusion,
  excludeSameFamily,
  onToggleExcludeSameFamily,
}: ExclusionManagerProps) {
  const [participantId, setParticipantId] = useState("");
  const [excludedId, setExcludedId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (participantId && excludedId && participantId !== excludedId) {
      onAddExclusion(participantId, excludedId);
      setParticipantId("");
      setExcludedId("");
    }
  };

  const getParticipantName = (id: string) => {
    return participants.find((p) => p.id === id)?.name || "Inconnu";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Exclusions</h2>
      <p className="text-sm text-gray-600 mb-4">
        Définissez qui ne peut pas tirer qui (ex: couples, membres d'une même
        famille)
      </p>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={excludeSameFamily}
            onChange={onToggleExcludeSameFamily}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            <span className="font-medium text-gray-800">
              Exclure automatiquement les membres de la même famille
            </span>
          </div>
        </label>
        <p className="text-sm text-gray-600 mt-2 ml-8">
          Les participants avec le même nom de famille ne pourront pas se tirer
          entre eux
        </p>
      </div>

      {participants.length < 2 ? (
        <p className="text-gray-500 text-center py-8">
          Ajoutez au moins 2 participants pour créer des exclusions
        </p>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-3 items-center">
              <select
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                ne peut pas tirer
              </span>

              <select
                value={excludedId}
                onChange={(e) => setExcludedId(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
              >
                <Ban size={20} />
                Ajouter
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {exclusions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Aucune exclusion définie
              </p>
            ) : (
              exclusions.map((exclusion) => (
                <div
                  key={exclusion.id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                >
                  <div className="flex items-center gap-3 text-gray-800">
                    <span className="font-medium">
                      {getParticipantName(exclusion.participant_id)}
                    </span>
                    <Ban size={16} className="text-orange-600" />
                    <span className="font-medium">
                      {getParticipantName(exclusion.excluded_participant_id)}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteExclusion(exclusion.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
