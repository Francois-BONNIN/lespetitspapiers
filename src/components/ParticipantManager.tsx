import { useState, useRef } from "react";
import { UserPlus, Trash2, Download, Upload } from "lucide-react";
import { Participant } from "../lib/database";

interface ParticipantManagerProps {
  participants: Participant[];
  onAddParticipant: (name: string, email: string, family: string) => void;
  onDeleteParticipant: (id: string) => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
}

export function ParticipantManager({
  participants,
  onAddParticipant,
  onDeleteParticipant,
  onExportData,
  onImportData,
}: ParticipantManagerProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [family, setFamily] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddParticipant(name.trim(), email.trim(), family.trim());
      setName("");
      setEmail("");
      setFamily("");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportData(file);
      e.target.value = "";
    }
  };

  // Grouper les participants par famille
  const participantsByFamily = participants.reduce((acc, participant) => {
    const familyName = participant.family || "";
    if (!acc[familyName]) {
      acc[familyName] = [];
    }
    acc[familyName].push(participant);
    return acc;
  }, {} as Record<string, Participant[]>);

  // Générer une couleur pour chaque famille
  const getFamilyColor = (familyName: string, index: number) => {
    const colors = [
      {
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-700",
        badge: "bg-blue-100",
      },
      {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-700",
        badge: "bg-green-100",
      },
      {
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-700",
        badge: "bg-purple-100",
      },
      {
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        badge: "bg-orange-100",
      },
      {
        bg: "bg-pink-50",
        border: "border-pink-200",
        text: "text-pink-700",
        badge: "bg-pink-100",
      },
      {
        bg: "bg-indigo-50",
        border: "border-indigo-200",
        text: "text-indigo-700",
        badge: "bg-indigo-100",
      },
      {
        bg: "bg-teal-50",
        border: "border-teal-200",
        text: "text-teal-700",
        badge: "bg-teal-100",
      },
      {
        bg: "bg-cyan-50",
        border: "border-cyan-200",
        text: "text-cyan-700",
        badge: "bg-cyan-100",
      },
    ];

    if (familyName === "Seul") {
      return {
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-700",
        badge: "bg-gray-100",
      };
    }

    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Participants</h2>
        <div className="flex gap-2">
          <button
            onClick={onExportData}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
            title="Exporter les participants et contraintes"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={handleImportClick}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
            title="Importer les participants et contraintes"
          >
            <Upload size={16} />
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du participant"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optionnel)"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
            placeholder="Famille (optionnel)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <UserPlus size={20} />
            Ajouter
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {participants.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucun participant pour le moment
          </p>
        ) : (
          (() => {
            // Vérifier s'il y a au moins une famille définie
            const hasFamilies = Object.keys(participantsByFamily).some(
              (key) => key !== ""
            );

            return Object.entries(participantsByFamily).map(
              ([familyName, familyMembers], familyIndex) => {
                const colors = getFamilyColor(familyName, familyIndex);
                // Afficher "Autre Famille" uniquement si familyName est vide ET qu'il y a d'autres familles
                const shouldShowOtherFamily = familyName === "" && hasFamilies;

                return (
                  <div key={familyName} className="space-y-2">
                    {familyName !== "" && (
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-sm font-semibold ${colors.text} uppercase tracking-wide`}
                        >
                          Famille {familyName}
                        </h3>
                        <span
                          className={`${colors.badge} ${colors.text} text-xs px-2 py-1 rounded-full font-medium`}
                        >
                          {familyMembers.length}{" "}
                          {familyMembers.length > 1 ? "membres" : "membre"}
                        </span>
                      </div>
                    )}
                    {shouldShowOtherFamily && (
                      <div className="flex items-center gap-2">
                        <h3
                          className={`text-sm font-semibold ${colors.text} uppercase tracking-wide`}
                        >
                          Autre Famille
                        </h3>
                        <span
                          className={`${colors.badge} ${colors.text} text-xs px-2 py-1 rounded-full font-medium`}
                        >
                          {familyMembers.length}{" "}
                          {familyMembers.length > 1 ? "membres" : "membre"}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {familyMembers.map((participant) => (
                        <div
                          key={participant.id}
                          className={`flex items-center justify-between p-3 ${colors.bg} border ${colors.border} rounded-lg hover:shadow-md transition-all min-w-[250px] flex-1`}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {participant.name}
                            </p>
                            {participant.email && (
                              <p className="text-xs text-gray-500 mt-1">
                                {participant.email}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => onDeleteParticipant(participant.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            );
          })()
        )}
      </div>
    </div>
  );
}
