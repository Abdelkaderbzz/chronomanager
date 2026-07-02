'use client';

import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePomodoro } from '@/hooks/use-pomodoro';
import { GardenRow, PlantVisual } from '@/components/pomodoro/plant-visual';
import {
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Timer,
  Settings2,
  Sprout,
  Maximize2,
} from 'lucide-react';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const phaseLabels = {
  idle: 'Ready to focus',
  focus: 'Focus time',
  shortBreak: 'Short break',
  longBreak: 'Long break',
};

type PomodoroPanelProps = {
  compact?: boolean;
};

export function PomodoroPanel({ compact = false }: PomodoroPanelProps) {
  const {
    phase,
    remainingSeconds,
    isRunning,
    progress,
    linkedTask,
    currentPlant,
    garden,
    sessionsInCycle,
    totalSessions,
    settings,
    toggleTimer,
    resetTimer,
    skipPhase,
    updateSettings,
    resetGarden,
  } = usePomodoro();

  const phaseColor =
    phase === 'focus'
      ? 'text-amber-500'
      : phase === 'longBreak'
        ? 'text-violet-500'
        : phase === 'shortBreak'
          ? 'text-teal-500'
          : 'text-muted-foreground';

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      <Tabs defaultValue='timer' className='w-full'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='timer' className='gap-1.5'>
            <Timer className='h-3.5 w-3.5' />
            Timer
          </TabsTrigger>
          <TabsTrigger value='garden' className='gap-1.5'>
            <Sprout className='h-3.5 w-3.5' />
            Garden
          </TabsTrigger>
          <TabsTrigger value='settings' className='gap-1.5'>
            <Settings2 className='h-3.5 w-3.5' />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value='timer' className='space-y-5 mt-4'>
          <div className='flex flex-col items-center gap-4'>
            <PlantVisual
              stage={currentPlant.stage}
              growthPoints={currentPlant.growthPoints}
              size={compact ? 'md' : 'lg'}
            />

            <div className='text-center space-y-1'>
              <p className={`text-sm font-medium ${phaseColor}`}>
                {phaseLabels[phase]}
              </p>
              <p className='text-5xl font-display font-bold tabular-nums tracking-tight'>
                {formatTime(remainingSeconds)}
              </p>
              {linkedTask && (
                <p className='text-xs text-muted-foreground max-w-[240px] truncate'>
                  Working on: {linkedTask.taskTitle}
                </p>
              )}
            </div>

            <div className='w-full max-w-xs space-y-2'>
              <div className='h-2 rounded-full bg-muted overflow-hidden'>
                <div
                  className={`h-full transition-all duration-1000 ${
                    phase === 'focus'
                      ? 'bg-amber-400'
                      : phase === 'longBreak'
                        ? 'bg-violet-400'
                        : 'bg-teal-400'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className='flex justify-between text-[11px] text-muted-foreground'>
                <span>Cycle {sessionsInCycle}/{settings.sessionsUntilLongBreak}</span>
                <span>{totalSessions} total sessions</span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                size='lg'
                className='rounded-full px-8 bg-amber-400 text-[#080810] hover:bg-amber-300'
                onClick={toggleTimer}
              >
                {isRunning ? (
                  <>
                    <Pause className='h-4 w-4 mr-2' />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className='h-4 w-4 mr-2' />
                    {phase === 'idle' ? 'Start focus' : 'Resume'}
                  </>
                )}
              </Button>
              <Button variant='outline' size='icon' onClick={resetTimer} title='Reset'>
                <RotateCcw className='h-4 w-4' />
              </Button>
              {phase !== 'idle' && (
                <Button variant='outline' size='icon' onClick={skipPhase} title='Skip'>
                  <SkipForward className='h-4 w-4' />
                </Button>
              )}
            </div>

            {!compact && (
              <Link href='/app/focus'>
                <Button variant='ghost' size='sm' className='text-muted-foreground'>
                  <Maximize2 className='h-3.5 w-3.5 mr-1.5' />
                  Open focus mode
                </Button>
              </Link>
            )}
          </div>
        </TabsContent>

        <TabsContent value='garden' className='space-y-4 mt-4'>
          <div className='rounded-xl border bg-muted/30 p-4 text-center space-y-3'>
            <p className='text-sm font-medium'>Current plant</p>
            <PlantVisual
              stage={currentPlant.stage}
              growthPoints={currentPlant.growthPoints}
              size='md'
            />
            <p className='text-xs text-muted-foreground'>
              Complete focus sessions to help your plant grow from seed to bloom.
            </p>
          </div>

          {garden.length > 0 && (
            <div className='space-y-2'>
              <p className='text-sm font-medium text-center'>Your garden ({garden.length})</p>
              <GardenRow plants={garden} />
            </div>
          )}

          <div className='grid grid-cols-2 gap-2 text-center text-xs'>
            {(['seed', 'sprout', 'sapling', 'young', 'mature', 'bloom'] as const).map(
              (s) => (
                <div
                  key={s}
                  className={`rounded-lg border p-2 capitalize ${
                    currentPlant.stage === s ? 'border-amber-400/50 bg-amber-400/5' : ''
                  }`}
                >
                  {s}
                </div>
              )
            )}
          </div>
        </TabsContent>

        <TabsContent value='settings' className='space-y-5 mt-4'>
          <SettingSlider
            label='Focus duration'
            value={settings.focusMinutes}
            min={5}
            max={60}
            step={5}
            suffix='min'
            onChange={(v) => updateSettings({ focusMinutes: v })}
          />
          <SettingSlider
            label='Short break'
            value={settings.shortBreakMinutes}
            min={1}
            max={30}
            step={1}
            suffix='min'
            onChange={(v) => updateSettings({ shortBreakMinutes: v })}
          />
          <SettingSlider
            label='Long break'
            value={settings.longBreakMinutes}
            min={5}
            max={45}
            step={5}
            suffix='min'
            onChange={(v) => updateSettings({ longBreakMinutes: v })}
          />
          <SettingSlider
            label='Sessions before long break'
            value={settings.sessionsUntilLongBreak}
            min={2}
            max={8}
            step={1}
            suffix=''
            onChange={(v) => updateSettings({ sessionsUntilLongBreak: v })}
          />

          <div className='space-y-3 pt-2'>
            <SettingSwitch
              label='Auto-start breaks'
              checked={settings.autoStartBreaks}
              onCheckedChange={(v) => updateSettings({ autoStartBreaks: v })}
            />
            <SettingSwitch
              label='Auto-start focus after break'
              checked={settings.autoStartFocus}
              onCheckedChange={(v) => updateSettings({ autoStartFocus: v })}
            />
            <SettingSwitch
              label='Sound on complete'
              checked={settings.soundEnabled}
              onCheckedChange={(v) => updateSettings({ soundEnabled: v })}
            />
          </div>

          <Button
            variant='outline'
            className='w-full text-destructive hover:text-destructive'
            onClick={resetGarden}
          >
            Reset garden & history
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SettingSlider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className='space-y-3'>
      <div className='flex justify-between items-center'>
        <Label className='text-sm'>{label}</Label>
        <span className='text-sm font-medium tabular-nums'>
          {value}
          {suffix ? ` ${suffix}` : ''}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
      />
    </div>
  );
}

function SettingSwitch({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className='flex items-center justify-between'>
      <Label className='text-sm'>{label}</Label>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
