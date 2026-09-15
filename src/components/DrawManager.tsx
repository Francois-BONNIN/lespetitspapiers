import {
  Shuffle,
  Eye,
  Trash2,
  Download,
  MessageSquare,
  Check,
} from "lucide-react";
import { Participant, Draw } from "../lib/database";
import {
  exportDrawsToCSV,
  downloadCSV,
  generateMessageForDraw,
} from "../lib/csvExport";
import { useState } from "react";

interface DrawManagerProps {
  participants: Participant[];
  draws: Draw[];
  onPerformDraw: () => void;
  onClearDraws: () => void;
  isDrawing: boolean;
}

export function DrawManager({
  participants,
  draws,
  onPerformDraw,
  onClearDraws,
  isDrawing,
}: DrawManagerProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getParticipantName = (id: string) => {
    return participants.find((p) => p.id === id)?.name || "Inconnu";
  };

  const handleExportDraws = () => {
    const csvContent = exportDrawsToCSV(draws, participants);
    downloadCSV(
      csvContent,
      `tirage-secret-santa-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const handleCopyMessage = (draw: Draw) => {
    const drawerName = getParticipantName(draw.drawer_id);
    const drawnName = getParticipantName(draw.drawn_id);
    const message = generateMessageForDraw(drawerName, drawnName);

    navigator.clipboard.writeText(message).then(() => {
      setCopiedId(draw.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const hasDraws = draws.length > 0;
  const canDraw = participants.length >= 2 && !hasDraws;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Tirage au sort</h2>
        {hasDraws && (
          <div className="flex gap-2">
            <button
              onClick={handleExportDraws}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download size={18} />
              Export CSV
            </button>
            <button
              onClick={onClearDraws}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 size={18} />
              Réinitialiser
            </button>
          </div>
        )}
      </div>

      {!hasDraws ? (
        <div className="text-center py-8">
          {participants.length < 2 ? (
            <p className="text-gray-500 mb-4">
              Ajoutez au moins 2 participants pour effectuer un tirage
            </p>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                {participants.length} participants prêts pour le tirage
              </p>
              <button
                onClick={onPerformDraw}
                disabled={!canDraw || isDrawing}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shuffle size={24} />
                {isDrawing ? "Tirage en cours..." : "Effectuer le tirage"}
              </button>
            </>
          )}
        </div>
      ) : (
        <div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-green-800">
              <Eye size={20} />
              <p className="font-semibold">
                Tirage effectué ! Vous seul pouvez voir ces résultats.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {draws.map((draw) => (
              <div
                key={draw.id}
                className="p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-gray-800 text-lg">
                      {getParticipantName(draw.drawer_id)}
                    </span>
                    <span className="text-gray-500">→</span>
                    <span className="font-semibold text-blue-700 text-lg">
                      {getParticipantName(draw.drawn_id)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyMessage(draw)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      copiedId === draw.id
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {copiedId === draw.id ? (
                      <>
                        <Check size={18} />
                        Copié !
                      </>
                    ) : (
                      <>
                        <MessageSquare size={18} />
                        Copier message
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note :</strong> Informez chaque participant
              individuellement de son attribution. Ces résultats ne sont
              visibles que par vous, l'organisateur.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
