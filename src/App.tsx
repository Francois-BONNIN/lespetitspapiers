import { useState, useEffect } from "react";
import { Gift } from "lucide-react";
import {
  Participant,
  Exclusion,
  Inclusion,
  Draw,
  getParticipants,
  getExclusions,
  getInclusions,
  getDraws,
  getExcludeSameFamilySetting,
  setExcludeSameFamilySetting,
  addParticipant,
  deleteParticipant,
  addExclusion,
  deleteExclusion,
  addInclusion,
  deleteInclusion,
  saveDraws,
  clearDraws as clearStoredDraws,
} from "./lib/database";
import { performDraw } from "./lib/drawAlgorithm";
import {
  exportParticipantsToCSV,
  downloadCSV,
  importParticipantsFromCSV,
} from "./lib/csvExport";
import { ParticipantManager } from "./components/ParticipantManager";
import { ExclusionManager } from "./components/ExclusionManager";
import { InclusionManager } from "./components/InclusionManager";
import { DrawManager } from "./components/DrawManager";

function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [exclusions, setExclusions] = useState<Exclusion[]>([]);
  const [inclusions, setInclusions] = useState<Inclusion[]>([]);
  const [draws, setDraws] = useState<Draw[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [excludeSameFamily, setExcludeSameFamilyState] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setParticipants(getParticipants());
    setExclusions(getExclusions());
    setInclusions(getInclusions());
    setDraws(getDraws());
    setExcludeSameFamilyState(getExcludeSameFamilySetting());
  };

  const handleAddParticipant = (
    name: string,
    email: string,
    family: string
  ) => {
    try {
      const newParticipant = addParticipant(
        name,
        email || null,
        family || null
      );
      setParticipants([...participants, newParticipant]);
    } catch (error) {
      alert("Erreur lors de l'ajout du participant");
      console.error(error);
    }
  };

  const handleDeleteParticipant = (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce participant ?")) {
      return;
    }

    try {
      deleteParticipant(id);
      loadData(); // Recharger toutes les données car les exclusions et tirages peuvent être affectés
    } catch (error) {
      alert("Erreur lors de la suppression");
      console.error(error);
    }
  };

  const handleAddExclusion = (participantId: string, excludedId: string) => {
    const exists = exclusions.some(
      (e) =>
        e.participant_id === participantId &&
        e.excluded_participant_id === excludedId
    );

    if (exists) {
      alert("Cette exclusion existe déjà");
      return;
    }

    try {
      const newExclusion = addExclusion(participantId, excludedId);
      setExclusions([...exclusions, newExclusion]);
    } catch (error) {
      alert("Erreur lors de l'ajout de l'exclusion");
      console.error(error);
    }
  };

  const handleDeleteExclusion = (id: string) => {
    try {
      deleteExclusion(id);
      setExclusions(exclusions.filter((e) => e.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression");
      console.error(error);
    }
  };

  const handleAddInclusion = (participantId: string, includedId: string) => {
    const exists = inclusions.some(
      (i) =>
        i.participant_id === participantId &&
        i.included_participant_id === includedId
    );

    if (exists) {
      alert("Cette restriction existe déjà");
      return;
    }

    try {
      const newInclusion = addInclusion(participantId, includedId);
      setInclusions([...inclusions, newInclusion]);
    } catch (error) {
      alert("Erreur lors de l'ajout de la restriction");
      console.error(error);
    }
  };

  const handleDeleteInclusion = (id: string) => {
    try {
      deleteInclusion(id);
      setInclusions(inclusions.filter((i) => i.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression");
      console.error(error);
    }
  };

  const handlePerformDraw = () => {
    setIsDrawing(true);

    const results = performDraw(
      participants,
      exclusions,
      inclusions,
      excludeSameFamily
    );

    if (!results) {
      alert(
        "Impossible de réaliser un tirage avec ces contraintes. Essayez de réduire les exclusions ou d'ajuster les restrictions."
      );
      setIsDrawing(false);
      return;
    }

    const drawsToInsert = results.map((r) => ({
      drawer_id: r.drawer_id,
      drawn_id: r.drawn_id,
    }));

    try {
      const newDraws = saveDraws(drawsToInsert);
      setDraws(newDraws);
    } catch (error) {
      alert("Erreur lors de l'enregistrement du tirage");
      console.error(error);
    }

    setIsDrawing(false);
  };

  const handleClearDraws = () => {
    if (!confirm("Êtes-vous sûr de vouloir réinitialiser le tirage ?")) {
      return;
    }

    try {
      clearStoredDraws();
      setDraws([]);
    } catch (error) {
      alert("Erreur lors de la réinitialisation");
      console.error(error);
    }
  };

  const handleToggleExcludeSameFamily = () => {
    const newValue = !excludeSameFamily;
    setExcludeSameFamilyState(newValue);
    setExcludeSameFamilySetting(newValue);
  };

  const handleExportData = () => {
    const csvContent = exportParticipantsToCSV(
      participants,
      exclusions,
      inclusions
    );
    downloadCSV(
      csvContent,
      `participants-secret-santa-${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const handleImportData = async (file: File) => {
    try {
      const content = await file.text();
      const importResult = importParticipantsFromCSV(content);

      if (!importResult) {
        alert("Erreur lors de l'import du fichier CSV");
        return;
      }

      // Ajouter les participants
      const participantMap = new Map<string, string>();
      importResult.participants.forEach((p) => {
        const newParticipant = addParticipant(p.name, p.email, p.family);
        participantMap.set(p.name, newParticipant.id);
      });

      // Ajouter les exclusions
      importResult.exclusions.forEach((e) => {
        const participantId = participantMap.get(e.participantName);
        const excludedId = participantMap.get(e.excludedName);
        if (participantId && excludedId) {
          try {
            addExclusion(participantId, excludedId);
          } catch (error) {
            console.error("Erreur lors de l'ajout d'une exclusion:", error);
          }
        }
      });

      // Ajouter les inclusions
      importResult.inclusions.forEach((i) => {
        const participantId = participantMap.get(i.participantName);
        const includedId = participantMap.get(i.includedName);
        if (participantId && includedId) {
          try {
            addInclusion(participantId, includedId);
          } catch (error) {
            console.error("Erreur lors de l'ajout d'une inclusion:", error);
          }
        }
      });

      // Recharger toutes les données
      loadData();
      alert(
        `Import réussi ! ${importResult.participants.length} participant(s) ajouté(s).`
      );
    } catch (error) {
      alert("Erreur lors de la lecture du fichier CSV");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Gift size={48} className="text-red-600" />
            <h1 className="text-5xl font-bold text-gray-800">Sacré Noël</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Le fameux tirage des petits papiers en ligne
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ParticipantManager
            participants={participants}
            onAddParticipant={handleAddParticipant}
            onDeleteParticipant={handleDeleteParticipant}
            onExportData={handleExportData}
            onImportData={handleImportData}
          />

          <ExclusionManager
            participants={participants}
            exclusions={exclusions}
            onAddExclusion={handleAddExclusion}
            onDeleteExclusion={handleDeleteExclusion}
            excludeSameFamily={excludeSameFamily}
            onToggleExcludeSameFamily={handleToggleExcludeSameFamily}
          />
        </div>

        <div className="mb-6">
          <InclusionManager
            participants={participants}
            inclusions={inclusions}
            onAddInclusion={handleAddInclusion}
            onDeleteInclusion={handleDeleteInclusion}
          />
        </div>

        <DrawManager
          participants={participants}
          draws={draws}
          onPerformDraw={handlePerformDraw}
          onClearDraws={handleClearDraws}
          isDrawing={isDrawing}
        />
      </div>
    </div>
  );
}

export default App;
