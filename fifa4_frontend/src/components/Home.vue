<template>
  <div>
    <h1>Home</h1>
    <div v-if="data">
      <p> 닉네임: {{ data.nickname }}</p>
      <p> 레벨: {{ data.level }}</p>
      <p> 공식경기 최고 등급: {{ data.rank.division }}, 달성일: {{ data.rank.achievementDate }} </p>
      <p> 감독모드 최고 등급: {{ data.autoRank.division }}, 달성일: {{ data.autoRank.achievementDate }} </p>
    </div>
    <div v-if="analysisData">

      <p>경기 수 : {{ analysisData.count }} </p>
      <p>평균 드리블 거리: {{ analysisData.avgDribbleDistance / analysisData.count }}</p>
      <p>평균 파울 수: {{ analysisData.avgFoulCount / analysisData.count }}</p>
      <p>평균 코너킥 수: {{ analysisData.avgCornerKickCount / analysisData.count }}</p>
      <p>평균 점유율: {{ analysisData.avgPossession / analysisData.count }}</p>
      <p>평균 오프사이드 수: {{ analysisData.avgOffsideCount / analysisData.count }}</p>
      <p>매치 결과: {{ analysisData.winCount }}승 {{ analysisData.drawCount }}무 {{ analysisData.loseCount }}패</p>

      <p>몰수 승: {{ analysisData.matchEndTypeCounts.forfeitWin }}, 몰수 패: {{ analysisData.matchEndTypeCounts.forfeitLose }}
      </p>
      <p>키보드 경기 수: {{ analysisData.controllerTypes.keyboard }}, 패드 경기 수: {{ analysisData.controllerTypes.pad }}, 기타: {{
        analysisData.controllerTypes.etc }} </p>

      <p>슛 : {{ analysisData.shootTotal }}, 경기 당 슛 평균: {{ analysisData.shootTotal / analysisData.count }} </p>
      <p>유효 슛 : {{ analysisData.effectiveShootTotal }}, 경기 당 유효 슛 평균: {{
        analysisData.effectiveShootTotal / analysisData.count }} </p>
      <p>골 : {{ analysisData.goalTotal }}, 경기 당 골 평균: {{ analysisData.goalTotal / analysisData.count }} </p>
      <p>자책 골 : {{ analysisData.ownGoal }}, 경기 당 자책 골 평균: {{ analysisData.ownGoal / analysisData.count }}</p>
      <p>헤딩 슛 : {{ analysisData.shootHeading }}, 경기 당 헤딩 슛 평균: {{ analysisData.shootHeading / analysisData.count }}</p>
      <p>헤딩 골 : {{ analysisData.goalHeading }}, 경기 당 헤딩 골 평균: {{ analysisData.goalHeading / analysisData.count }}</p>
      <p>프리킥 슛 : {{ analysisData.shootFreekick }}, 경기 당 프리킥 슛 평균: {{ analysisData.shootFreekick / analysisData.count }}
      </p>
      <p>프리킥 골 : {{ analysisData.goalFreekick }}, 경기 당 프리킥 골 평균: {{ analysisData.goalFreekick / analysisData.count }}</p>
      <p>박스 안 슛 : {{ analysisData.shootInPenalty }}, 경기 당 박스 안 슛 평균: {{ analysisData.shootInPenalty / analysisData.count
      }}
      </p>
      <p>박스 안 골 : {{ analysisData.goalInPenalty }}, 경기 당 박스 안 골 평균: {{ analysisData.goalInPenalty / analysisData.count }}
      </p>
      <p>박스 밖 슛 : {{ analysisData.shootOutPenalty }}, 경기 당 박스 밖 슛 평균: {{ analysisData.shootOutPenalty / analysisData.count
      }}</p>
      <p>박스 밖 골 : {{ analysisData.goalOutPenalty }}, 경기 당 박스 밖 골 평균: {{ analysisData.goalOutPenalty / analysisData.count
      }}
      </p>

      <p>중거리슛 시도 비율 : {{ analysisData.shootOutPenalty / analysisData.shootTotal * 100 }}</p>
      <p>골대 맞은 슛 (NoGal) : {{ analysisData.hitPost }}</p>
      <p>shootTypes : {{ analysisData.shootTypes }}</p>
      <p>슛 시간 : {{ analysisData.goalTimes }}</p>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';
const router = useRouter();
export default {
  name: 'Home',
  data() {
    return {
      data: null,
      analysisData: null,
    }
  },

  methods: {
    async handleSearch() {

      this.data = null;
      const nickName = this.$route.query.nickName;

      if (!nickName) {
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/searchNickName?nickName=${this.$route.query.nickName}`);
        console.log(response.data)
        this.data = response.data
        this.analysisData = this.analysis_data(response.data, nickName)

        // TODO: handle response data
      } catch (error) {
        console.error(error);
        alert('구단주를 찾을 수 없습니다.')
        this.router.push('/');
      }
    },

    convertGoalTime(goalTime) {
      let convertedTime = null;
      let timeType = null;

      if (goalTime >= 0 && goalTime < Math.pow(2, 24)) {
        convertedTime = goalTime;
        timeType = "전반"
      } else if (goalTime >= Math.pow(2, 24) && goalTime < Math.pow(2, 24) * 2) {
        timeType = "후반"
        convertedTime = goalTime - Math.pow(2, 24) + 45 * 60;
      } else if (goalTime >= Math.pow(2, 24) * 2 && goalTime < Math.pow(2, 24) * 3) {
        timeType = "연장전 전반"
        convertedTime = goalTime - Math.pow(2, 24) * 2 + 90 * 60;
      } else if (goalTime >= Math.pow(2, 24) * 3 && goalTime < Math.pow(2, 24) * 4) {
        timeType = "연장전 후반"
        convertedTime = goalTime - Math.pow(2, 24) * 3 + 105 * 60;
      } else if (goalTime >= Math.pow(2, 24) * 4 && goalTime < Math.pow(2, 24) * 5) {
        timeType = "승부차기"
        // 승부차기
        convertedTime = goalTime - Math.pow(2, 24) * 4 + 120 * 60;
      }

      const minutes = Math.floor(convertedTime / 60); // 분 계산
      const remainingSeconds = convertedTime % 60; // 나머지 초 계산

      const result = { type: timeType, time: minutes + "분" + remainingSeconds + "초" };

      return result;
    },

    analysis_data(data, nickName) {

      // 변수 선언
      // MatchDetailDTO
      let dribbleSum = 0;
      let foulSum = 0;
      let cornerKickSum = 0;
      let possessionSum = 0;
      let offsideCountSum = 0;
      let winCount = 0;
      let drawCount = 0;
      let loseCount = 0;
      let matchEndTypeCounts = { normal: 0, forfeitWin: 0, forfeitLose: 0 };
      let controllerTypes = { keyboard: 0, pad: 0, etc: 0 };

      // ShootDTO
      let shootTotal = 0; // Integer	총 슛 수 
      let effectiveShootTotal = 0; // Integer	총 유효슛 수 
      let goalTotal = 0; //Integer	총 골 수  (실제 골 수)
      let ownGoal = 0; // Integer	자책 골 수 
      let shootHeading = 0; //Integer	헤딩 슛 수 
      let goalHeading = 0;	//Integer	헤딩 골 수 
      let shootFreekick = 0; //Integer	프리킥 슛 수 
      let goalFreekick = 0; //Integer	프리킥 골 수 
      let shootInPenalty = 0; //Integer	인패널티 슛 수 
      let goalInPenalty = 0; // Integer	인패널티 골 수 
      let shootOutPenalty = 0; // Integer	아웃패널티 슛 수 
      let goalOutPenalty = 0; //	Integer	아웃패널티 골 수 

      let shootTypes = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0
      }

      let hitPost = 0;

      let goalTimes = [];

      for (const match of data.matchList) {
        const targetData = match.matchInfo.filter(item => item.nickname === nickName)[0];

        // MatchDetailDTO
        dribbleSum += targetData.matchDetail.dribble;
        foulSum += targetData.matchDetail.foul;
        cornerKickSum += targetData.matchDetail.cornerKick;
        possessionSum += targetData.matchDetail.possession;
        offsideCountSum += targetData.matchDetail.offsideCount;
        if (targetData.matchDetail.matchResult === '승') {
          winCount++;
        } else if (targetData.matchDetail.matchResult === '무') {
          drawCount++;
        } else if (targetData.matchDetail.matchResult === '패') {
          loseCount++;
        }
        if (targetData.matchDetail.matchEndType === 0) {
          matchEndTypeCounts.normal++;
        } else if (targetData.matchDetail.matchEndType === 1) {
          matchEndTypeCounts.forfeitWin++;
        } else if (targetData.matchDetail.matchEndType === 2) {
          matchEndTypeCounts.forfeitLose++;
        }
        controllerTypes[targetData.matchDetail.controller]++;

        //ShootDTO
        shootTotal += targetData.shoot.shootTotal;
        effectiveShootTotal += targetData.shoot.effectiveShootTotal;
        goalTotal += targetData.shoot.goalTotal;
        ownGoal += targetData.shoot.ownGoal;
        shootHeading += targetData.shoot.shootHeading;
        goalHeading += targetData.shoot.goalHeading;
        shootFreekick += targetData.shoot.shootFreekick;
        goalFreekick += targetData.shoot.goalFreekick;
        shootInPenalty += targetData.shoot.shootInPenalty;
        goalInPenalty += targetData.shoot.goalInPenalty;
        shootOutPenalty += targetData.shoot.shootOutPenalty;
        goalOutPenalty += targetData.shoot.goalOutPenalty;

        //ShootDetailDTO
        const shootDetailList = targetData.shootDetail;
        for (const shootDetail of shootDetailList) {
          let goalTime = this.convertGoalTime(shootDetail.goalTime);
          goalTime["result"] = shootDetail.result;
          goalTimes.push(goalTime);
          shootTypes[shootDetail.type]++;
          if (shootDetail.hitPost && shootDetail.result != 3) {
            hitPost++;
          }
        }
      }

      // 결과 출력
      const count = data.matchList.length;
      const analysisData = {
        count: count,
        avgDribbleDistance: dribbleSum,
        avgFoulCount: foulSum,
        avgCornerKickCount: cornerKickSum,
        avgPossession: possessionSum,
        avgOffsideCount: offsideCountSum,
        winCount,
        drawCount,
        loseCount,
        matchEndTypeCounts,
        controllerTypes,
        shootTotal,
        effectiveShootTotal,
        goalTotal,
        ownGoal,
        shootHeading,
        goalHeading,
        shootFreekick,
        goalFreekick,
        shootInPenalty,
        goalInPenalty,
        shootOutPenalty,
        goalOutPenalty,
        hitPost,
        shootTypes,
        goalTimes
      };

      console.log(analysisData)

      return analysisData
    }
  },
  watch: {
    // watch for changes in the route query object to call handleSearch method
    '$route.query.nickName': {
      immediate: true, // call the method immediately when the component is created
      handler: 'handleSearch',
    }
  }
};
</script>
