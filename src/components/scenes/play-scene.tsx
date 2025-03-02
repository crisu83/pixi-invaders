import { Container, useTick } from "@pixi/react";
import { DebugOverlay } from "@/components/debug/debug-overlay";
import { EnemyGrid } from "@/components/entities/enemy-grid";
import { ExplosionGroup } from "@/components/entities/explosion-group";
import { MissileGroup } from "@/components/entities/missile-group";
import { Player } from "@/components/entities/player";
import { Background } from "@/components/ui/background";
import { PerformanceStats } from "@/components/ui/performance-stats";
import { MuteIndicator } from "@/components/ui/text";
import { ComboText, ScoreText } from "@/components/ui/text";
import { STAGE_SIZE } from "@/constants";
import { useGame } from "@/hooks/use-game";
import { useMusic } from "@/hooks/use-music";
import { useToggles } from "@/hooks/use-toggles";
import { useAudioStore } from "@/stores/audio-store";
import { useDebugStore } from "@/stores/debug-store";
import { useScoreStore } from "@/stores/score-store";
import { useCollisionChecker } from "@/utils/collision-checker";
import { getSpriteRef } from "@/utils/entity-helpers";

type PlaySceneProps = {
  onGameOver: (score: number) => void;
  onVictory: (score: number) => void;
};

export function PlayScene({ onGameOver, onVictory }: PlaySceneProps) {
  const [stageWidth, stageHeight] = STAGE_SIZE;

  // UI state
  const { showStats } = useDebugStore();
  const { muted } = useAudioStore();
  const { score, combo } = useScoreStore();

  // Game state and handlers
  const {
    gameStarted,
    gameOver,
    player,
    enemies,
    missiles,
    explosions,
    handlePlayerMissileSpawn,
    handleEnemyMissileSpawn,
    removeMissile,
    removeExplosion,
    handlePlayerDeath,
    handleEnemyDeath,
  } = useGame({ onGameOver, onVictory });

  const {
    checkMissileEnemyCollisions,
    checkMissilePlayerCollisions,
    checkEnemyPlayerCollisions,
    resetCollisionChecks,
  } = useCollisionChecker();

  useMusic();
  useToggles();

  // Update game logic
  useTick(() => {
    if (!gameStarted || gameOver) return;

    // Reset collision checks at the start of each tick
    resetCollisionChecks();

    // Check collisions
    const enemyCollision = checkEnemyPlayerCollisions();
    const missileCollision = checkMissilePlayerCollisions();
    if (enemyCollision.collision || missileCollision.collision) {
      if (missileCollision.collision && missileCollision.entity1) {
        removeMissile(missileCollision.entity1.id);
      }
      handlePlayerDeath();
      return;
    }

    const missileHit = checkMissileEnemyCollisions();
    if (missileHit.collision && missileHit.entity1 && missileHit.entity2) {
      removeMissile(missileHit.entity1.id);
      handleEnemyDeath(missileHit.entity2);
    }
  });

  return (
    <>
      <Container>
        <Background />
      </Container>
      <Container position={[stageWidth / 2, stageHeight / 2]}>
        <ScoreText
          value={score}
          position={[-stageWidth / 2 + 20, -stageHeight / 2 + 15]}
        />
        <ComboText
          combo={combo}
          position={[-stageWidth / 2 + 20, -stageHeight / 2 + 45]}
        />
        <MuteIndicator
          position={[stageWidth / 2 - 20, stageHeight / 2 - 40]}
          visible={muted}
        />
        <PerformanceStats
          position={[stageWidth / 2 - 20, -stageHeight / 2 + 15]}
          visible={showStats}
        />
        {player && (
          <Player
            entity={player}
            onMissileSpawn={handlePlayerMissileSpawn}
            ref={getSpriteRef(player)}
          />
        )}
        <EnemyGrid enemies={enemies} onMissileSpawn={handleEnemyMissileSpawn} />
        <MissileGroup missiles={missiles} onMissileDestroy={removeMissile} />
        <ExplosionGroup
          explosions={explosions}
          onExplosionComplete={removeExplosion}
        />
        <DebugOverlay
          player={player}
          enemies={enemies}
          missiles={missiles}
          explosions={explosions}
        />
      </Container>
    </>
  );
}
