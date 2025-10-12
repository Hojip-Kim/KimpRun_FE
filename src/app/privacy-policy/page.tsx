'use client';

import React from 'react';
import {
  Container,
  Header,
  Title,
  Subtitle,
  Divider,
  ContentGrid,
  Section,
  SectionTitle,
  Paragraph,
  List,
  ListItem,
  InfoCard,
  InfoIcon,
  InfoContent,
  Footer,
  FooterText,
} from '@/components/legal-pages/SharedStyles';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <Container>
      <Header>
        <Title>개인정보 처리방침</Title>
        <Subtitle>개인정보 보호 및 처리에 관한 정책</Subtitle>
        <Divider />
      </Header>

      <Paragraph>
        김프런팀(이하 '팀')은 「개인정보보호법」에 따라 이용자의 개인정보 보호 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다. "개인정보처리방침"이란 이용자의 소중한 개인정보를 보호함으로써 이용자가 안심하고 서비스를 이용할 수 있도록 팀이 준수해야 할 지침을 의미합니다.
      </Paragraph>

      <ContentGrid>
        <Section>
          <SectionTitle>1. 개인정보의 처리 목적</SectionTitle>
          <Paragraph>
            팀은 개인정보를 다음의 목적을 위해 처리합니다. 이용 목적이 변경될 시에는 사전동의를 구할 예정입니다.
          </Paragraph>
          <Paragraph><strong>가. 홈페이지 회원가입 및 관리</strong></Paragraph>
          <Paragraph>
            회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 각종 고지·통지, 고충처리, 분쟁 조정을 위한 기록 보존 등을 목적으로 개인정보를 처리합니다.
          </Paragraph>
          <Paragraph><strong>나. 재화 또는 서비스 제공</strong></Paragraph>
          <Paragraph>
            서비스 제공, 계약서·청구서 발송, 콘텐츠 제공, 맞춤 서비스 제공, 본인인증, 연령인증, 요금결제·정산, 채권추심 등을 목적으로 개인정보를 처리합니다.
          </Paragraph>
          <Paragraph><strong>다. 고충처리</strong></Paragraph>
          <Paragraph>
            민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보 등의 목적으로 개인정보를 처리합니다.
          </Paragraph>
          <Paragraph><strong>라. 마케팅 및 광고에의 활용</strong></Paragraph>
          <Paragraph>
            신규 서비스(제품) 개발 및 맞춤 서비스 제공, 이벤트 및 광고성 정보 제공 및 참여기회 제공, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재, 서비스의 유효성 확인, 접속빈도 파악 또는 회원의 서비스 이용에 대한 통계 등을 목적으로 개인정보를 처리합니다.
          </Paragraph>
          <Paragraph><strong>바. 해킹/사기 관련 사고 조사</strong></Paragraph>
          <Paragraph>
            해킹/사기 관련 사고 조사 및 기타 법령상 의무이행 등에 따른 정당하고 합법적인 수사요청 시 자료제공
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>2. 개인정보의 수집 및 보유기간</SectionTitle>
          <Paragraph>팀은 다음의 개인정보 항목을 처리하고 있습니다.</Paragraph>
          <Paragraph><strong>가. 개인정보 항목</strong></Paragraph>
          <List>
            <ListItem>(회원 가입 및 회원 관리) 이메일</ListItem>
            <ListItem>(서비스 이용 과정이나 사업처리 과정에서 자동으로 생성되는 정보) 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</ListItem>
          </List>
          <Paragraph><strong>나. 수집방법</strong></Paragraph>
          <Paragraph>홈페이지에서의 회원 가입 시 회원이 직접 제공</Paragraph>
          <Paragraph><strong>다. 보유근거</strong></Paragraph>
          <Paragraph>회원의 동의 (만 14세 미만 아동개인정보 수집시 법정 대리인 동의)</Paragraph>
          <Paragraph><strong>라. 보유기간</strong></Paragraph>
          <Paragraph>
            이용자의 탈퇴 요청 및 개인정보 동의를 철회하는 때까지. 다만, 팀은 팀의 약관에 따른 회원의 부정이용기록 또는 부정이용이 의심되는 기록이 있는 경우에는 이용자의 탈퇴 요청 및 개인정보 동의의 철회에도 불구하고, 수집 시점으로부터 5년간 보관하고 파기합니다.
          </Paragraph>
          <Paragraph><strong>마. 관련법령에 의한 보관</strong></Paragraph>
          <List>
            <ListItem>서비스 이용 관련 개인정보(로그인기록) - 「통신비밀보호법」: 3개월</ListItem>
            <ListItem>표시/광고에 관한 기록 - 「전자상거래 등에서의 소비자보호에 관한 법률」: 6개월</ListItem>
            <ListItem>계약 또는 청약철회 등에 관한 기록 - 「전자상거래 등에서의 소비자보호에 관한 법률」: 5년</ListItem>
            <ListItem>대금결제 및 재화 등의 공급에 관한 기록 - 「전자상거래 등에서의 소비자보호에 관한 법률」: 5년</ListItem>
            <ListItem>소비자의 불만 또는 분쟁처리에 관한 기록 - 「전자상거래 등에서의 소비자보호에 관한 법률」: 3년</ListItem>
            <ListItem>전자금융 거래에 관한 기록 - 「전자금융거래법」: 5년</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>3. 개인정보의 제3자 제공</SectionTitle>
          <Paragraph>
            팀은 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 관련 법령에 따라 개인정보의 제3자 제공이 가능한 경우에만 개인정보를 제3자에게 제공합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>4. 정보주체의 권리, 의무 및 그 행사방법</SectionTitle>
          <Paragraph>이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.</Paragraph>
          <Paragraph><strong>가. 정보주체는 팀에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.</strong></Paragraph>
          <List>
            <ListItem>개인정보 열람요구</ListItem>
            <ListItem>오류 등이 있을 경우 정정요구</ListItem>
            <ListItem>삭제요구</ListItem>
            <ListItem>처리정지 요구</ListItem>
          </List>
          <Paragraph><strong>나.</strong> 제1항에 따른 권리 행사는 팀에 대해 「개인정보 보호법」 시행규칙 별지 제8호 서식에 따라 서면, 전자우편 등을 통하여 하실 수 있으며 팀은 이에 대해 지체 없이 조치하겠습니다.</Paragraph>
        </Section>

        <Section>
          <SectionTitle>5. 개인정보의 파기</SectionTitle>
          <Paragraph>
            팀은 원칙적으로 개인정보를 회원 탈퇴시 지체없이 해당 개인정보를 파기합니다. 파기의 절차, 기한 및 방법은 다음과 같습니다. 단, 이용자에게 개인정보 보관기간에 대해 별도의 동의를 얻은 경우, 또는 법령에서 일정 기간 정보보관 의무를 부과하는 경우에는 해당 기간 동안 개인정보를 안전하게 보관합니다.
          </Paragraph>
          <Paragraph><strong>가. 파기절차</strong></Paragraph>
          <Paragraph>
            이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져(종이의 경우 별도의 서류) 내부 방침 및 기타 관련 법령에 따라 일정기간 저장된 후 혹은 즉시 파기됩니다. 이 때, DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.
          </Paragraph>
          <Paragraph><strong>나. 파기방법</strong></Paragraph>
          <Paragraph>
            전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>6. 개인정보의 안전성 확보 조치</SectionTitle>
          <Paragraph>
            팀은 「개인정보보호법」 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.
          </Paragraph>
          <Paragraph><strong>가. 해킹 등에 대비한 기술적 대책</strong></Paragraph>
          <Paragraph>
            팀은 해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.
          </Paragraph>
          <Paragraph><strong>나. 개인정보의 암호화</strong></Paragraph>
          <Paragraph>
            이용자의 개인정보는 암호화되어 저장 및 관리되고 있어, 본인만이 알 수 있습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>7. 개인정보 자동 수집 장치의 설치, 운영 및 거부에 관한 사항</SectionTitle>
          <Paragraph>
            팀은 이용자 개개인에게 개인화되고 맞춤화된 서비스를 제공하기 위해서 회원의 정보를 저장하고 수시로 불러오는 쿠키(cookie)를 사용합니다.
          </Paragraph>
          <Paragraph><strong>가. 쿠키 등 사용 목적</strong></Paragraph>
          <Paragraph>
            회원과 비회원의 접속 빈도나 방문 시간 등을 분석, 이용자의 취향과 관심분야를 파악 및 자취 추적, 각종 이벤트 참여 정도 및 방문 회수 파악 등을 통한 타겟 마케팅 및 개인 맞춤 서비스 제공
          </Paragraph>
          <Paragraph><strong>나. 쿠키 설정 거부 방법</strong></Paragraph>
          <Paragraph>
            이용자들은 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서, 이용자는 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>8. 개인정보 보호책임자</SectionTitle>
          <Paragraph>
            팀은 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호 책임자를 지정하고 있습니다.
          </Paragraph>
          <Paragraph><strong>개인정보 보호책임자</strong></Paragraph>
          <List>
            <ListItem>성명: 김프런팀</ListItem>
            <ListItem>연락처: kimprun66@gmail.com</ListItem>
          </List>
          <Paragraph>
            이용자는 팀 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>9. 권익침해 구제방법</SectionTitle>
          <Paragraph>
            아래의 기관은 팀과는 별개의 기관으로서, 팀의 자체적인 개인정보 불만처리, 피해구제 결과에 만족하지 못하시거나 보다 자세한 도움이 필요하시면 문의하여 주시기 바랍니다.
          </Paragraph>
          <Paragraph><strong>개인정보 침해신고센터 (한국인터넷진흥원 운영)</strong></Paragraph>
          <List>
            <ListItem>소관업무: 개인정보 침해사실 신고, 상담 신청</ListItem>
            <ListItem>웹사이트: privacy.kisa.or.kr</ListItem>
            <ListItem>전화: (국번없이) 118</ListItem>
          </List>
          
          <Paragraph><strong>개인정보 분쟁조정위원회 (한국인터넷진흥원 운영)</strong></Paragraph>
          <List>
            <ListItem>소관업무: 개인정보 분쟁조정신청, 집단분쟁조정 (민사적 해결)</ListItem>
            <ListItem>웹사이트: privacy.kisa.or.kr</ListItem>
            <ListItem>전화: (국번없이) 118</ListItem>
          </List>
          
          <Paragraph><strong>대검찰청 사이버범죄수사단</strong></Paragraph>
          <List>
            <ListItem>웹사이트: www.spo.go.kr</ListItem>
            <ListItem>전화: 02-3480-3573</ListItem>
          </List>
          
          <Paragraph><strong>경찰청 사이버범죄수사단</strong></Paragraph>
          <List>
            <ListItem>웹사이트: www.netan.go.kr</ListItem>
            <ListItem>전화: 1566-0112</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>10. 개인정보 처리방침 변경</SectionTitle>
          <Paragraph>
            이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
          </Paragraph>
        </Section>
      </ContentGrid>

      <InfoCard>
        <InfoIcon>🛡️</InfoIcon>
        <InfoContent>
          <h4>개인정보보호 책임자</h4>
          <p>개인정보 처리 관련 문의는 kimprun66@gmail.com으로 연락주세요.</p>
        </InfoContent>
      </InfoCard>

      <Footer>
        <FooterText>
          <strong>시행일자:</strong> 2024년 1월 2일
          <br />
          개인정보처리방침 변경 시 웹사이트 공지사항을 통하여 공지할 것입니다.
        </FooterText>
      </Footer>
    </Container>
  );
};

export default PrivacyPolicyPage;
