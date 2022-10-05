import { useContext } from 'react';
import { Row, Col } from 'antd';
import styled from '@emotion/styled';
import StoryValidationItem from '../ui/StoryValidationItem';
import { AppContext } from '../../stores/AppStore';

const StoryValidationWrapper = styled('div')(() => ({
  width: '60%',
  margin: '0 auto',
}));

const StoryValidationSection = () => {
  const [state] = useContext(AppContext);

  return (
    <StoryValidationWrapper>
      <Row gutter={[24, 24]} style={{paddingBottom: 24}}>
        <Col span={24}>
          <StoryValidationItem
            title="1-location-1-area"
            description="Story has at least 1 location and 1 area defined"
            accomplished={state.storyVerifications.oneLocationOneArea}
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{paddingBottom: 24}}>
        <Col span={24}>
          <StoryValidationItem
            title="1-character"
            description="Story has at least 1 character defined"
            accomplished={state.storyVerifications.oneCharacter}
          />
        </Col>
      </Row>
    </StoryValidationWrapper>
  );
};

export default StoryValidationSection;
