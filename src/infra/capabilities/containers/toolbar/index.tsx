import { FC, useCallback } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '@classroom/infra/hooks/ui-store';
import { Toolbar, ToolProps, Tool } from '@classroom/ui-kit';
import { PensContainer } from './pens';
import { BoardCleanersContainer } from './board-cleaners';
import { SliceContainer } from './slice';
import {
  visibilityControl,
  visibilityListItemControl,
  boardEraserEnabled,
  boardHandEnabled,
  boardLaserPointerEnabled,
  boardMouseEnabled,
  boardPencilEnabled,
  boardSaveEnabled,
  boardSelectorEnabled,
  boardSwitchEnabled,
  boardTextEnabled,
  breakoutRoomEnabled,
  cloudStorageEnabled,
  rosterEnabled,
  screenShareEnabled,
  toolbarEnabled,
} from 'agora-common-libs';
import {
  CabinetItemEnum,
  ToolbarItemCategory,
} from '@classroom/infra/stores/common/toolbar/type';
import { useExtensionCabinets } from '@classroom/infra/hooks/cabinet';

export const WhiteboardToolbar = visibilityControl(
  observer(() => {
    const {
      toolbarUIStore,
      streamWindowUIStore: { containedStreamWindowCoverOpacity },
    } = useStore();
    const {
      activeTool,
      activeMap,
      activeCabinetItems,
      flatTools,
      setTool,
      openBuiltinCabinet,
    } = toolbarUIStore;
    const { isInstalled, openExtensionCabinet } = useExtensionCabinets();

    const handleCabinetItemClick = useCallback(
      (id: string) => {
        if (isInstalled(id)) {
          openExtensionCabinet(id, false);
        } else {
          openBuiltinCabinet(id);
        }
      },
      [isInstalled, openExtensionCabinet, openBuiltinCabinet],
    );

    const mappedTools = flatTools.map((tool) => {
      if (tool.category === ToolbarItemCategory.PenPicker) {
        return {
          ...tool,
          component: () => {
            return <PensContainer />;
          },
        };
      } else if (tool.category === ToolbarItemCategory.Eraser) {
        return {
          ...tool,
          component: () => {
            return <BoardCleanersContainer />;
          },
        };
      } else if (tool.category === ToolbarItemCategory.Slice) {
        return {
          ...tool,
          component: () => {
            return <SliceContainer />;
          },
        };
      }
      return tool;
    });

    return mappedTools.length > 0 ? (
      <Toolbar style={{ opacity: containedStreamWindowCoverOpacity }}>
        {mappedTools.map((item) => {
          const isCabinetItem = item.category === ToolbarItemCategory.CabinetItem;
          const isActive = isCabinetItem
            ? activeCabinetItems.has(item.value) || !!activeMap[item.value]
            : activeTool === item.value || !!activeMap[item.value];
          return (
            <ToolItem
              key={item.value}
              {...(item as ToolProps)}
              onClick={isCabinetItem ? handleCabinetItemClick : setTool}
              isActive={isActive}
              category={item.category}
            />
          );
        })}
      </Toolbar>
    ) : null;
  }),
  toolbarEnabled,
);

const ToolItem: FC<
  ToolProps & {
    onClick?: (value: string) => void;
    isActive: boolean;
    category: ToolbarItemCategory;
  }
> = visibilityListItemControl(
  (props) => {
    return <Tool {...props} />;
  },
  (uiConfig, item) => {
    // 白板自身工具
    if (!boardEraserEnabled(uiConfig) && item.category === ToolbarItemCategory.Eraser) {
      return false;
    }
    if (!boardHandEnabled(uiConfig) && item.category === ToolbarItemCategory.Hand) {
      return false;
    }
    if (!boardMouseEnabled(uiConfig) && item.category === ToolbarItemCategory.Clicker) {
      return false;
    }
    if (!boardPencilEnabled(uiConfig) && item.category === ToolbarItemCategory.PenPicker) {
      return false;
    }
    if (!boardSaveEnabled(uiConfig) && item.category === ToolbarItemCategory.Save) {
      return false;
    }
    if (!boardSelectorEnabled(uiConfig) && item.category === ToolbarItemCategory.Selector) {
      return false;
    }
    if (!boardTextEnabled(uiConfig) && item.category === ToolbarItemCategory.Text) {
      return false;
    }
    if (!cloudStorageEnabled(uiConfig) && item.category === ToolbarItemCategory.CloudStorage) {
      return false;
    }
    if (!rosterEnabled(uiConfig) && item.category === ToolbarItemCategory.Roster) {
      return false;
    }

    // 从 cabinet 拍平上来的工具，按 value 走原本 cabinet 内的可见性开关
    if (item.category === ToolbarItemCategory.CabinetItem) {
      if (!screenShareEnabled(uiConfig) && item.value === CabinetItemEnum.ScreenShare) {
        return false;
      }
      if (!boardLaserPointerEnabled(uiConfig) && item.value === CabinetItemEnum.Laser) {
        return false;
      }
      if (!breakoutRoomEnabled(uiConfig) && item.value === CabinetItemEnum.BreakoutRoom) {
        return false;
      }
      if (!boardSwitchEnabled(uiConfig) && item.value === CabinetItemEnum.Whiteboard) {
        return false;
      }
      // VideoGallery 和扩展 widget（countdownTimer 等）没有专门的 UIConfig 开关
    }

    return true;
  },
);
