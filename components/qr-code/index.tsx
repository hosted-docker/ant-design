import React, { useContext } from 'react';
import ReloadOutlined from '@ant-design/icons/ReloadOutlined';
import classNames from 'classnames';
import { QRCodeCanvas, QRCodeSVG } from '@rc-component/qrcode';

import { devUseWarning } from '../_util/warning';
import Button from '../button';
import type { ConfigConsumerProps } from '../config-provider';
import { ConfigContext } from '../config-provider';
import { useLocale } from '../locale';
import Spin from '../spin';
import { useToken } from '../theme/internal';
import type { QRCodeProps, QRProps } from './interface';
import useStyle from './style/index';

const QRCode: React.FC<QRCodeProps> = (props) => {
  const [, token] = useToken();
  const {
    value,
    type = 'canvas',
    icon = '',
    size = 160,
    iconSize,
    color = token.colorText,
    errorLevel = 'M',
    status = 'active',
    bordered = true,
    onRefresh,
    style,
    className,
    rootClassName,
    prefixCls: customizePrefixCls,
    bgColor = 'transparent',
    ...rest
  } = props;
  const { getPrefixCls } = useContext<ConfigConsumerProps>(ConfigContext);
  const prefixCls = getPrefixCls('qrcode', customizePrefixCls);

  const [wrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const imageSettings: QRProps['imageSettings'] = {
    src: icon,
    x: undefined,
    y: undefined,
    height: typeof iconSize === 'number' ? iconSize : iconSize?.height ?? 40,
    width: typeof iconSize === 'number' ? iconSize : iconSize?.width ?? 40,
    excavate: true,
    crossOrigin: 'anonymous',
  };

  const qrCodeProps = {
    value,
    size,
    level: errorLevel,
    bgColor,
    fgColor: color,
    style: { width: style?.width, height: style?.height },
    imageSettings: icon ? imageSettings : undefined,
  };

  const [locale] = useLocale('QRCode');

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('QRCode');

    warning(!!value, 'usage', 'need to receive `value` props');

    warning(
      !(icon && errorLevel === 'L'),
      'usage',
      'ErrorLevel `L` is not recommended to be used with `icon`, for scanning result would be affected by low level.',
    );
  }

  if (!value) {
    return null;
  }

  const mergedCls = classNames(prefixCls, className, rootClassName, hashId, cssVarCls, {
    [`${prefixCls}-borderless`]: !bordered,
  });

  const mergedStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    ...style,
    width: style?.width ?? size,
    height: style?.height ?? size,
  };

  return wrapCSSVar(
    <div {...rest} className={mergedCls} style={mergedStyle}>
      {status !== 'active' && (
        <div className={`${prefixCls}-mask`}>
          {status === 'loading' && <Spin />}
          {status === 'expired' && (
            <>
              <p className={`${prefixCls}-expired`}>{locale?.expired}</p>
              {onRefresh && (
                <Button type="link" icon={<ReloadOutlined />} onClick={onRefresh}>
                  {locale?.refresh}
                </Button>
              )}
            </>
          )}
          {status === 'scanned' && <p className={`${prefixCls}-scanned`}>{locale?.scanned}</p>}
        </div>
      )}
      {type === 'canvas' ? <QRCodeCanvas {...qrCodeProps} /> : <QRCodeSVG {...qrCodeProps} />}
    </div>,
  );
};

if (process.env.NODE_ENV !== 'production') {
  QRCode.displayName = 'QRCode';
}

export default QRCode;
