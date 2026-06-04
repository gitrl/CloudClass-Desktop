import { FC, PropsWithChildren } from 'react';
import classnames from 'classnames';
import { BaseProps } from '../util/type';
import './index.css';

export { Pens } from './pens';
export { ToolCabinet } from './tool-cabinet';
export { BoardCleaners } from './board-cleaners';
export { Slice } from './slice';
export { Tool } from './tool';
export type { ToolProps } from './tool';

export interface ToolbarProps extends BaseProps {
  // 保留这两个 prop 是为了不破坏外部调用方的签名；横向工具栏没有折叠概念，传入也不生效
  defaultOpened?: boolean;
  onOpenedChange?: (opened: boolean) => void;
}

/**
 * 横向工具栏容器：水平铺开所有工具，居中显示，无折叠/无纵向滚动。
 * 老的右侧竖条 + 折叠动画已废弃。
 */
export const Toolbar: FC<PropsWithChildren<ToolbarProps>> = ({ className, style, children }) => {
  const cls = classnames('toolbar', 'toolbar-horizontal', {
    [`${className}`]: !!className,
  });

  return (
    <div className="toolbar-position toolbar-position-horizontal">
      <div className={cls} style={style}>
        <div className="tools tools-horizontal">{children}</div>
      </div>
    </div>
  );
};
