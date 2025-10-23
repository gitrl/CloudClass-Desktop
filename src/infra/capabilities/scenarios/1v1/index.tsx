import { useStore } from '@classroom/infra/hooks/ui-store';
import classnames from 'classnames';
import { Layout } from '@classroom/ui-kit/components/layout';
import { Button } from '@classroom/ui-kit';
import { DialogContainer } from '@classroom/infra/capabilities/containers/dialog';
import { LoadingContainer } from '@classroom/infra/capabilities/containers/loading';
import { NavigationBar } from '@classroom/infra/capabilities/containers/nav';
import { FixedAspectRatioRootBox } from '@classroom/infra/capabilities/containers/root-box/fixed-aspect-ratio';
import { Room1v1StreamsContainer } from '@classroom/infra/capabilities/containers/stream/room-1v1-player';
import { ToastContainer } from '@classroom/infra/capabilities/containers/toast';
import { SceneSwitch } from '../../containers/scene-switch';
import { ScenesController } from '../../containers/scenes-controller';
import { ScreenShareContainer } from '../../containers/screen-share';
import { StreamWindowsContainer } from '../../containers/stream-window';
import { WhiteboardToolbar } from '../../containers/toolbar';
import { WidgetContainer } from '../../containers/widget';
import { Chat, Watermark, Whiteboard } from '../../containers/widget/slots';
import { OneToOneClassAside as Aside } from '@classroom/infra/capabilities/containers/aside';
import Room from '../room';
import { useState } from 'react';
import { EduClassroomConfig } from 'agora-edu-core';
import ImgGuide from "./img_guide.png"

const MaskWidget = (props: {onClick?: () => void}) => {
  return (
    <div className='one-on-one-class-room-mask'>
      <div className='one-on-one-class-room-mask-description'>
        <img src={ImgGuide} style={{}}></img>
      </div>
      <div className='fcr-text-center'><Button type='primary' onClick={props.onClick} style={{width: '240px', height: '42px'}}>知道了</Button></div>
    </div>
  )
}

export const OneToOneScenario = () => {
  const layoutCls = classnames('edu-room', 'one-on-one-class-room');
  const { shareUIStore } = useStore();
  const [showMask, setShowMask] = useState(true);
  // 获取身份
  const { role } = EduClassroomConfig.shared.sessionInfo // role === 1 老师端
  // 确认关闭蒙层遮罩
  const closeMask = () => {
    setShowMask(false)
  }

  return  (
    <>
      {
        (role == 1 && showMask) ? (
          <MaskWidget onClick={closeMask} />
        ) : (
          <Room>
            <FixedAspectRatioRootBox trackMargin={{ top: shareUIStore.navHeight }}>
              <SceneSwitch>
                <Layout className={layoutCls} direction="col">
                  <NavigationBar />
                  <Layout className="fcr-flex-grow fcr-items-stretch fcr-room-bg fcr-h-full">
                    <Layout
                      className="fcr-flex-grow fcr-items-stretch fcr-relative"
                      direction="col"
                      style={{ paddingTop: 2 }}>
                      <Whiteboard />
                      <ScreenShareContainer />
                      <WhiteboardToolbar />
                      <ScenesController />
                      <StreamWindowsContainer />
                    </Layout>
                    <Aside>
                      <Room1v1StreamsContainer />
                      <Chat />
                    </Aside>
                  </Layout>
                  <DialogContainer />
                  <LoadingContainer />
                </Layout>
                <WidgetContainer />
                <ToastContainer />
                <Watermark />
              </SceneSwitch>
            </FixedAspectRatioRootBox>
          </Room>
        )
      }
    </>
  )
};
