import { useLectureH5UIStores, useStore } from '@classroom/infra/hooks/ui-store';
import { EduLectureH5UIStore } from '@classroom/infra/stores/lecture-mobile';
import { EduClassroomConfig } from 'agora-edu-core';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import {SvgIconEnum, SvgImg, SvgImgMobile } from '@classroom/ui-kit';

import { useI18n } from 'agora-common-libs';
import { ComponentLevelRules } from '../../config';
import { MobileCallState } from '@classroom/infra/stores/lecture-mobile/layout';

export const Chat = observer(function Chat() {
  const { widgetUIStore } = useStore();
  const { ready } = widgetUIStore;
  useEffect(() => {
    if (ready) {
      const chatWidgetId = 'easemobIM';

      if (ready) {
        widgetUIStore.createWidget(chatWidgetId);
      }

      return () => {
        widgetUIStore.destroyWidget(chatWidgetId);
      };
    }
  }, [ready]);

  return <div className="widget-slot-chat fcr-h-full" />;
});

export const Whiteboard = observer(function Board() {
  const { boardUIStore } = useStore();

  const { isCopying } = boardUIStore;

  return (
    <React.Fragment>
      <div
        style={{ height: boardUIStore.boardAreaHeight, zIndex: ComponentLevelRules.WhiteBoard }}
        className="widget-slot-board"
      />
      {isCopying && <Spinner />}
    </React.Fragment>
  );
});

const Spinner = () => {
  const transI18n = useI18n();

  return (
    <div className="spinner-container">
      <div className="spinner-contianer-innner">
        <div className="spinner"></div> {transI18n('whiteboard.loading')}
      </div>
    </div>
  );
};

export const CountDownMobile = observer(() => {
  return <div className="fcr-countdown-mobile-widget"></div>;
});
export const PollMobile = observer(() => {
  const {
    shareUIStore: { isLandscape },
  } = useStore();
  return <div className={`fcr-poll-mobile-widget ${isLandscape ? '' : 'fcr-relative'}`}></div>;
});
export const WhiteboardMobile = observer(function Board() {
  const {
    boardUIStore,
    streamUIStore: { containerH5VisibleCls },
    shareUIStore: { isLandscape },
  } = useLectureH5UIStores() as EduLectureH5UIStore;

  const {
    iconBorderZoomType,
    iconZoomVisibleCls,
    handleBoradZoomStatus,
    boardContainerHeight,
    boardContainerWidth,
    mounted,
  } = boardUIStore;
  const height = mounted && !isLandscape ? boardContainerHeight : 0;
  return (
    <div
      className={classnames('whiteboard-mobile-container fcr-w-full fcr-relative', containerH5VisibleCls)}
      style={{
        height: height,
        width: boardContainerWidth,
        visibility: isLandscape ? 'hidden' : 'visible',
        overflow: 'hidden',
      }}>
      <div
        style={{
          height: height,
          width: boardContainerWidth,
          zIndex: ComponentLevelRules.WhiteBoard,
        }}
        className="widget-slot-board"
      />
      <SvgImg
        type={iconBorderZoomType}
        className={classnames('whiteboard-zoom-status', iconZoomVisibleCls)}
        onClick={handleBoradZoomStatus}
      />
    </div>
  );
});

export const ChatMobile = observer(function Chat() {
  // 自定义按钮打开设置互动弹窗
  const {
    layoutUIStore: { handsUpActionSheetVisible, setHandsUpActionSheetVisible, broadcastCallState },
  } = useLectureH5UIStores();
  const getCallIcon = () => {
      return {
        icon: SvgIconEnum.CALLING_MOBILE,
        colors: {
          iconPrimary: 'rgba(66, 98, 255, 1)',
          iconSecondary: 'rgba(66, 98, 255, 1)',
        },
      };
  };
  const {
    widgetUIStore,
    streamUIStore: {
      teacherCameraStream,
      studentCameraStreams,
      studentVideoStreamSize,
      studentStreamsVisible,
      isPiP,
    },
    boardUIStore: { boardContainerHeight, mounted },
    shareUIStore: { isLandscape, forceLandscape },
    layoutUIStore: { classRoomPlacholderMobileHeight },
  } = useLectureH5UIStores();
  const { navigationBarUIStore,rosterUIStore } = useStore();
  const { classStatusText } = navigationBarUIStore;
  const { teacherName } = rosterUIStore;

  const { ready } = widgetUIStore;
  const [chatH5Height, setChatH5Height] = useState(0);
  const calcHeight = () => {
    const h5Height = document.body.clientHeight;
    //页面高度-课堂占位符高度-白板高度-老师视频高度-学生视频高度
    const height =
      h5Height -
      (!mounted && (!teacherCameraStream || teacherCameraStream.isCameraMuted)
        ? classRoomPlacholderMobileHeight
        : 0) -
      (mounted ? boardContainerHeight : 0) -
      (teacherCameraStream && !teacherCameraStream.isCameraMuted && !isPiP
        ? boardContainerHeight
        : 0) -
      (studentCameraStreams.length > 0 && studentStreamsVisible
        ? studentVideoStreamSize.height
        : 0);
    setChatH5Height(height);
  };
  useEffect(() => {
    calcHeight();
    window.addEventListener('resize', calcHeight);
    () => window.removeEventListener('resize', calcHeight);
  }, [isLandscape, forceLandscape, mounted, teacherCameraStream, boardContainerHeight, isPiP, studentCameraStreams.length, studentVideoStreamSize.height, teacherCameraStream?.isCameraMuted, studentStreamsVisible]);

  useEffect(() => {
    if (ready) {
      const chatWidgetId = 'easemobIM';

      if (ready) {
        widgetUIStore.createWidget(chatWidgetId);
      }

      return () => {
        widgetUIStore.destroyWidget(chatWidgetId);
      };
    }
  }, [ready]);
  const transI18n = useI18n();
  return (
    <div
      className="widget-slot-chat-mobile widget-slot-chat-mobile-diy"
      style={{
        height: chatH5Height,
        background: 'rgba(32, 32, 32, 1)',
      }}
    >
        <div className="fcr-mobile-inter-room-info-diy">
              <div className="fcr-mobile-inter-room-info-left">
                {teacherName && (
                  <div className="fcr-mobile-inter-room-info-teacher-name">
                    <span>{transI18n('chat.teacher')}:</span>
                    <span>{teacherName}</span>
                  </div>
                )}
              </div>
              <div className="fcr-mobile-inter-room-info-right">
                <div className="fcr-mobile-inter-room-info-start-time">{classStatusText}</div>
              </div>
        </div>
        <div
          className="fcr-hands-up-action-sheet-call-mobile-diy"
          onClick={() => setHandsUpActionSheetVisible(true)}
        >
          <SvgImgMobile 
            landscape={isLandscape}
            forceLandscape={forceLandscape}
            type={getCallIcon().icon}
            colors={{ ...getCallIcon().colors }}
            size={30}
          ></SvgImgMobile>
        </div>
    </div>
  );
});

export const Watermark = observer(function Chat() {
  const { widgetUIStore, classroomStore } = useStore();
  const { ready } = widgetUIStore;

  const watermark =
    classroomStore.connectionStore.mainRoomScene &&
    classroomStore.roomStore?.mainRoomDataStore.flexProps?.watermark;

  useEffect(() => {
    if (ready && watermark) {
      widgetUIStore.createWidget('watermark', {
        userProperties: {},
        properties: {
          content: EduClassroomConfig.shared.sessionInfo.userName,
          visible: true,
        },
        trackProperties: {},
      });
      return () => {
        widgetUIStore.destroyWidget('watermark');
      };
    }
  }, [ready, watermark]);

  return (
    <div className="widget-slot-watermark fcr-h-full fcr-w-full fcr-absolute fcr-top-0 fcr-left-0 fcr-pointer-events-none" />
  );
});
