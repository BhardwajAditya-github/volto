import React, { Fragment } from 'react';
// import { defineMessages, useIntl } from 'react-intl';

import { map } from 'lodash';
import { hasBlocksData } from '../../helpers/blocks';
import { DefaultBlockView } from './DefaultBlockView';
import type { Content } from '@plone/types';
import type { BlocksConfigData } from '@plone/types';
import type { Location } from 'history';

type RenderBlocksProps = {
  /**
   * Plone content object
   */
  content: Content;
  /**
   * Current blocks configuration object
   * From the registry or local to this instance (eg. in a blocks in block container)
   */
  blocksConfig: BlocksConfigData;
  /**
   * Wrap the blocks in an enclosing tag
   * From the registry or local to this instance (eg. in a blocks in block container)
   */
  as: React.ElementType;
  /**
   * Router location object
   */
  location: Location;
  /**
   * Metadata object
   * In case of the blocks in block container use case, it's the metadata (content data)
   * from the parent container, passed down to the contained blocks
   */
  metadata?: Content;
};

export const RenderBlocks = (props: RenderBlocksProps) => {
  const { blocksConfig, content, location, metadata } = props;
  const CustomTag = props.as || Fragment;

  return hasBlocksData(content) ? (
    <CustomTag>
      {map(content.blocks_layout.items, (block) => {
        const blockData = content.blocks?.[block];
        const blockType = blockData?.['@type'];
        // @ts-ignore
        const Block = blocksConfig[blockType]?.view || DefaultBlockView;

        return Block ? (
          <Block
            id={block}
            metadata={metadata}
            properties={content}
            data={blockData}
            path={location?.pathname || ''}
            blocksConfig={blocksConfig}
          />
        ) : blockData ? (
          <div key={block}>Unknown block found: {blockType}</div>
        ) : (
          <div key={block}>Invalid Block</div>
        );
      })}
    </CustomTag>
  ) : (
    ''
  );
};
