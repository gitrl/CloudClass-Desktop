import { useStore } from '@classroom/infra/hooks/ui-store';
import { observer } from 'mobx-react';
import React, { FC, PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { Button, SvgImg, SvgIconEnum } from '@classroom/ui-kit';
import { Volume } from './volume';
import { Field } from './form-field';
import { EduRteEngineConfig, EduRteRuntimePlatform } from 'agora-edu-core';
import { getAssetURL } from '@classroom/infra/utils';
import pretestAudio from './assets/pretest-audio.mp3';
import { useI18n } from 'agora-common-libs';

export const PretestVoice = observer(() => {
  const {
    pretestUIStore: {
      startRecordingDeviceTest,
      stopRecordingDeviceTest,
      startAudioRecordingPreview,
      stopAudioRecordingPreview,
    },
  } = useStore();
  useEffect(() => {
    startAudioRecordingPreview();
    startRecordingDeviceTest();

    return () => {
      stopAudioRecordingPreview();
      stopRecordingDeviceTest();
    };
  }, []);
  return (
    <div
      className="fcr-flex fcr-flex-grow fcr-flex-col"
      style={{
        padding: '60px 30px 40px',
        gap: 20,
      }}>
        <div style={{ color:'red',fontSize:15,fontWeight:600}}>
          为获得最佳上课体验，请您课前根据下方指引完成麦克风与扬声器测试。
        </div>
      <MicrophoneTest />
      <SpeakerTest />
    </div>
  );
});

const MicrophoneTest = observer(() => {
  const {
    pretestUIStore: { setRecordingDevice, currentRecordingDeviceId, recordingDevicesList ,localVolume},
  } = useStore();
  const {
    deviceSettingUIStore: { setUserHasSelectedAudioRecordingDevice },
  } = useStore();
  const transI18n = useI18n();
  return (
    <ItemCard>
      <ItemCardTitle>{transI18n('media.microphone')}
        <div style={{ marginLeft: 10 ,color:'red'}}>
          音量：{localVolume.toFixed(0) }
          {/* 如果音量小于50，提示用户增加音量 */}
          {localVolume < 50 && <span style={{ color:'red',fontSize:14,fontWeight:600,marginLeft:15}}>音量过小请检查设备</span>}
        </div>
      </ItemCardTitle>
      <ItemForm>
        <Field
          label=""
          type="select"
          value={currentRecordingDeviceId}
          options={recordingDevicesList.map((value) => ({
            text: value.label,
            value: value.value,
          }))}
          onChange={(value) => {
            setRecordingDevice(value);
            setUserHasSelectedAudioRecordingDevice();
          }}
        />
      </ItemForm>
      <VolumeDance />
    </ItemCard>
  );
});

const SpeakerTest = observer(() => {
  const {
    pretestUIStore: {
      playbackDevicesList,
      currentPlaybackDeviceId,
      localPlaybackTestVolume,
      setPlaybackDevice,
      startPlaybackDeviceTest,
      stopPlaybackDeviceTest,
      setAIDenoiser,
      aiDenoiserEnabled,
      aiDenoiserSupported,
    },
    deviceSettingUIStore: { setUserHasSelectedAudioPlaybackDevice },
  } = useStore();
  const handlePlaybackChange = useCallback((value: string) => {
    setPlaybackDevice(value);
    setUserHasSelectedAudioPlaybackDevice();
  }, []);

  useEffect(() => {
    return stopPlaybackDeviceTest;
  }, []);

  const transI18n = useI18n();

  const enableAIDenoiser = useCallback(() => {
    setAIDenoiser(true);
  }, []);
  const disableAIDenoiser = useCallback(() => {
    setAIDenoiser(false);
  }, []);

  const audioPlayUrl = useMemo(() => {
    if (EduRteEngineConfig.platform === EduRteRuntimePlatform.Electron) {
      return getAssetURL('pretest-audio.mp3');
    }
    return pretestAudio;
  }, []);

  return (
    <ItemCard>
      <ItemCardTitle>{transI18n('media.speaker')}
        {/* <div style={{ marginLeft: 10 ,color:'red'}}>
          扬声器测试音量：{parseInt(localPlaybackTestVolume) }
        </div> */}
      </ItemCardTitle>
      <ItemForm>
        <Field
          label=""
          type="select"
          value={currentPlaybackDeviceId}
          options={playbackDevicesList.map((value) => ({
            text: value.label,
            value: value.value,
          }))}
          onChange={handlePlaybackChange}
        />
        <Button
          className="fcr-speaker-test-btn"
          type="primary"
          size="sm"
          icon={
            <SvgImg colors={{ iconPrimary: '#fff' }} type={SvgIconEnum.PRETEST_SPEAKER} size={24} />
          }
          onClick={() => startPlaybackDeviceTest(audioPlayUrl)}>
          {transI18n('pretest.test')}
        </Button>
      </ItemForm>
      
      {aiDenoiserSupported && (
        <React.Fragment>
          <ItemCardTitle>{transI18n('pretest.audio_noise_cancellation')}</ItemCardTitle>
          <div className="fcr-flex">
            <div
              onClick={enableAIDenoiser}
              className="fcr-cursor-pointer fcr-mr-4 fcr-flex fcr-items-center">
              <SvgImg
                type={aiDenoiserEnabled ? SvgIconEnum.PRETEST_CHECKED : SvgIconEnum.PRETEST_CHECK}
              />
              <span className="fcr-text-level1">{transI18n('pretest.on')}</span>
            </div>
            <div
              onClick={disableAIDenoiser}
              className="fcr-cursor-pointer fcr-flex fcr-items-center">
              <SvgImg
                type={aiDenoiserEnabled ? SvgIconEnum.PRETEST_CHECK : SvgIconEnum.PRETEST_CHECKED}
              />
              <span className="fcr-text-level1">{transI18n('pretest.off')}</span>
            </div>
          </div>
        </React.Fragment>
      )}
    </ItemCard>
  );
});

const VolumeDance: FC = observer(() => {
  const {
    pretestUIStore: { localPreviewVolume , localVolume},
  } = useStore();

  return (
      <div className="fcr-flex fcr-items-center" style={{ gap: 10 }}>
        <SvgImg type={SvgIconEnum.MICROPHONE_ON} />
        <Volume maxLength={18} cursor={localPreviewVolume} peek={100} />
      </div>
  );
});

const ItemCardTitle: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className="fcr-mt-4 fcr-text-level1 fcr-flex fcr-items-center"
      style={{
        fontWeight: 700,
        fontSize: 16,
      }}>
      {children}
    </div>
  );
};

const ItemForm: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className="fcr-pretest-audio fcr-flex fcr-justify-center fcr-items-center"
      style={{
        gap: 8,
        height: 42,
      }}>
      {children}
    </div>
  );
};

const ItemCard: FC<PropsWithChildren> = ({ children }) => (
  <div
    className="fcr-flex fcr-flex-col"
    style={{
      borderRadius: 18,
      padding: 20,
      boxSizing: 'border-box',
      gap: 16,
      background: 'rgba(51, 50, 68, 0.1)',
    }}>
    {children}
  </div>
);
