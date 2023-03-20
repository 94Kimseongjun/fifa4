<template>
  <div>
    <div v-if="data">

      <v-card variant="tonal">

        <v-row>
          <v-col cols="4">
            <h1>{{ data.nickname }}<br>레벨: {{ data.level }}<br>{{ this.controllerType }} 유저</h1>
          </v-col>

          <v-col cols="4" alignSelf="center">
            <img :src="data.rank.ico_img"><br> 공식경기 최고 등급 - {{ data.rank.division }} <br>
            달성일 - {{ data.rank.achievementDate }}
          </v-col>
          <v-col cols="4" alignSelf="center">
            <img :src="data.autoRank.ico_img"><br> 감독모드 최고 등급 - {{ data.autoRank.division }}<br>
            달성일 - {{ data.autoRank.achievementDate }}
          </v-col>
        </v-row>
      </v-card>


      <v-container fluid>

        <v-row style="height: 400px;">
          <v-col cols="3">
            <div v-if="chartData">
              <EchartPie :chartData="chartData" width="50%" height="auto"></EchartPie>
            </div>
          </v-col>
          <v-col cols="3">
            <div v-if="shootTimeChartData">
              <EchartShootTime :shootChartData="shootTimeChartData" width="50%" height="auto"></EchartShootTime>
            </div>
          </v-col>
          <v-col cols="6">

            <div v-if="shootTypeChartData">
              <EchartShootType :shootChartData="shootTypeChartData" width="100%" height="auto"></EchartShootType>
            </div>

          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card class="d-flex align-center justify-center" style="height: 50px;">
              <v-card-text>{{ analysisData.winCount }}승{{ analysisData.drawCount }}무/{{ analysisData.loseCount }}패 승률 {{
                (analysisData.winCount) / (analysisData.count) * 100 }}%</v-card-text>
              <v-card-text>{{ analysisData.totalScore }}득점 {{ analysisData.totalConcede }}실점</v-card-text>
              <v-card-text>평균 {{ (analysisData.totalScore / analysisData.count).toFixed(2) }}득점
                {{ (analysisData.totalConcede / analysisData.count).toFixed(2) }}실점</v-card-text>
            </v-card>

            <v-card class="d-flex align-center justify-center" style="height: 50px;">
              <v-card-text>중거리 슛 비율: {{ (analysisData.shootOutPenalty / analysisData.shootTotal * 100).toFixed(2)
              }}</v-card-text>
              <v-card-text>평균 평점 {{ (analysisData.totalSpRating / analysisData.player_count).toFixed(2) }}</v-card-text>
              <v-card-text>평균 점유율: {{ (analysisData.avgPossession / analysisData.count).toFixed(2) }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>






        <v-row>
          <v-col cols="2">
            평점 랭킹
            <div v-if="momPlayers">
              <div v-for="momPlayer in displayedMomPlayers" :key="momPlayer.name">
                <img :src="momPlayer.img" :alt="momPlayer.name" style="width: 50px; height: auto;">
                <img :src="momPlayer.seasonImg" :alt="momPlayer.season" style="width: 25px; height: auto;">
                <v-card class="d-flex align-center justify-center">
                  <v-card-text style="font-size: 10px !important;">{{ momPlayer.name }}<br>최고 평점 {{ momPlayer.cnt }}회<br>
                    최고 평점 평균 {{ (momPlayer.avgTopRating).toFixed(2) }}<br>
                    평균 평점 {{ (momPlayer.avgRating).toFixed(2) }}</v-card-text>
                </v-card>
              </div>
              <button @click="showMore">{{ ButtonText }}</button>
            </div>
          </v-col>

          <v-col cols="2">
            득점 랭킹
            <div v-if="goalRankPlayers">
              <div v-for="momPlayer in displayedGoalRankPlayers" :key="momPlayer.name">
                <img :src="momPlayer.img" :alt="momPlayer.name" style="width: 50px; height: auto;">
                <img :src="momPlayer.seasonImg" :alt="momPlayer.season" style="width: 25px; height: auto;">
                <v-card class="d-flex align-center justify-center">
                  <v-card-text style="font-size: 10px !important;">{{ momPlayer.name }}<br>득점 수 {{ momPlayer.cnt }}<br>
                    경기당 평균 득점 수 {{ (momPlayer.cnt / analysisData.count).toFixed(2) }}<br>
                    평균 평점 {{ (momPlayer.avgRating).toFixed(2) }}</v-card-text>
                </v-card>
              </div>
              <button @click="showMoreGoalRank">{{ ButtonTextGoalRank }}</button>
            </div>
          </v-col>
          <v-col cols="2">
            도움 랭킹
            <div v-if="assistRankPlayers">
              <div v-for="momPlayer in displayedAssistRankPlayers" :key="momPlayer.name">
                <img :src="momPlayer.img" :alt="momPlayer.name" style="width: 50px; height: auto;">
                <img :src="momPlayer.seasonImg" :alt="momPlayer.season" style="width: 25px; height: auto;">
                <v-card class="d-flex align-center justify-center">
                  <v-card-text style="font-size: 10px !important;">{{ momPlayer.name }}<br>도움 수 {{ momPlayer.cnt }}<br>
                    경기당 평균 도움 수 {{ (momPlayer.cnt / analysisData.count).toFixed(2) }}<br>
                    평균 평점 {{ (momPlayer.avgRating).toFixed(2) }}</v-card-text>
                </v-card>
              </div>
              <button @click="showMoreAssistRank">{{ ButtonTextAssistRank }}</button>
            </div>
          </v-col>

          <v-col cols="2">
            드리블 랭킹
            <div v-if="dribbleRankPlayers">
              <div v-for="momPlayer in displayedDribbleRankPlayers" :key="momPlayer.name">
                <img :src="momPlayer.img" :alt="momPlayer.name" style="width: 50px; height: auto;">
                <img :src="momPlayer.seasonImg" :alt="momPlayer.season" style="width: 25px; height: auto;">
                <v-card class="d-flex align-center justify-center">
                  <v-card-text style="font-size: 10px !important;">{{ momPlayer.name }}<br>드리블 거리(야드) {{ momPlayer.dribble
                  }}<br>
                  <!--
                  
                    경기당 평균 드리블 거리(야드) {{ (momPlayer.dribble / analysisData.count).toFixed(2) }}
                    <br>
 -->
                    평균 평점 {{ (momPlayer.avgRating).toFixed(2) }}</v-card-text>
                </v-card>
              </div>
              <button @click="showMoreDribbleRank">{{ ButtonTextDribbleRank }}</button>
            </div>
          </v-col>

          <v-col cols="2">
            패스 랭킹
            <div v-if="passRankPlayers">
              <div v-for="momPlayer in displayedPassRankPlayers" :key="momPlayer.name">
                <img :src="momPlayer.img" :alt="momPlayer.name" style="width: 50px; height: auto;">
                <img :src="momPlayer.seasonImg" :alt="momPlayer.season" style="width: 25px; height: auto;">
                <v-card class="d-flex align-center justify-center">
                  <v-card-text style="font-size: 10px !important;">{{ momPlayer.name }}<br>패스 수 {{ momPlayer.passTry }},
                    패스 성공 수 {{ momPlayer.passSuccess }}<br>
                    패스 성공률 {{ ((momPlayer.passSuccess / momPlayer.passTry) * 100).toFixed(2) }}
                    <br>
                    <!--
                    
                    경기당 평균 패스 수 {{ (momPlayer.passTry / analysisData.count).toFixed(2) }}
                    경기당 평균 패스 성공 수 {{ (momPlayer.passSuccess / analysisData.count).toFixed(2) }}
                    <br>
 -->

                    평균 평점 {{ (momPlayer.avgRating).toFixed(2) }}</v-card-text>
                </v-card>
              </div>
              <button @click="showMorePassRank">{{ ButtonTextPassRank }}</button>
            </div>
          </v-col>

          <v-col cols="2">
            태클 랭킹
            <div v-if="tackleRankPlayers">
              <div v-for="momPlayer in displayedTackleRankPlayers" :key="momPlayer.name">
                <img :src="momPlayer.img" :alt="momPlayer.name" style="width: 50px; height: auto;">
                <img :src="momPlayer.seasonImg" :alt="momPlayer.season" style="width: 25px; height: auto;">
                <v-card class="d-flex align-center justify-center">
                  <v-card-text style="font-size: 10px !important;">{{ momPlayer.name }}<br>태클 수 {{ momPlayer.tackleTry }}
                    태클 성공 수 {{ momPlayer.tackleSuccess }}<br>
                    태클 성공률 {{ ((momPlayer.tackleSuccess / momPlayer.tackleTry) * 100).toFixed(2) }}
                    <br>
                    <!-- 
                    
                    경기당 평균 태클 수 {{ (momPlayer.tackleTry / analysisData.count).toFixed(2) }}
                    경기당 평균 태클 성공 수 {{ (momPlayer.tackleSuccess / analysisData.count).toFixed(2) }}
                    <br>
-->

                    평균 평점 {{ (momPlayer.avgRating).toFixed(2) }}</v-card-text>
                </v-card>
              </div>
              <button @click="showMoreTackleRank">{{ ButtonTextTackleRank }}</button>
            </div>
          </v-col>



        </v-row>



        <v-col cols="6">
          <v-row no-gutters>
            <v-col v-for="(item, index) in analysisData.matchResult" :key="index">
              <v-card class="d-flex align-center justify-center"
                :style="{ backgroundColor: item.result === '승' ? 'rgba(0, 0, 255, 0.5)' : item.result === '무' ? 'rgba(128, 128, 128, 0.5)' : 'rgba(255, 0, 0, 0.5)', height: '60px' }">
                <v-card-text>{{ item.result }}<br>{{ item.score }}:{{ item.concede }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-container>

    </div>


    <!-- 
      <p>평균 드리블 거리: {{ analysisData.avgDribbleDistance / analysisData.count }}</p>
      <p>평균 파울 수: {{ analysisData.avgFoulCount / analysisData.count }}</p>
      <p>평균 코너킥 수: {{ analysisData.avgCornerKickCount / analysisData.count }}</p>
      <p>평균 오프사이드 수: {{ analysisData.avgOffsideCount / analysisData.count }}</p>
  <p>몰수 승: {{ analysisData.matchEndTypeCounts.forfeitWin }}, 몰수 패: {{ analysisData.matchEndTypeCounts.forfeitLose }} </p>
      <p>키보드 경기 수: {{ analysisData.controllerTypes.keyboard }}, 패드 경기 수: {{ analysisData.controllerTypes.pad }}, 기타: {{
        analysisData.controllerTypes.etc }} </p>
-->






    <!-- 
      <p>매치 결과: {{ analysisData.winCount }}승 {{ analysisData.drawCount }}무 {{ analysisData.loseCount }}패</p>


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


      <p>골대 맞은 슛 (NoGal) : {{ analysisData.hitPost }}</p>

-->

    <!-- 
      <p>shootTypes : {{ analysisData.shootTypes }}</p>
      
    -->



  </div>
</template>

<script>
import axios from 'axios';
//import { useRouter } from 'vue-router';
import EchartPie from './EchartPie.vue';
import EchartShootTime from './EchartShootTime.vue';
import EchartShootType from './EchartShootType.vue';
export default {
  name: 'Home',
  components: {
    EchartPie,
    EchartShootTime,
    EchartShootType
  },
  data() {
    return {
      data: null,
      analysisData: null,
      division_icon: null,
      controllerType: null,
      chartData: null,

      momPlayers: [],
      momDisplayCount: 3,
      ButtonText: '더보기',

      shootTimeChartData: null,
      shootTypeChartData: null,

      goalRankPlayers: [],
      goalRankDisplayCount: 3,
      ButtonTextGoalRank: '더보기',

      assistRankPlayers: [],
      assistRankDisplayCount: 3,
      ButtonTextAssistRank: '더보기',

      passRankPlayers: [],
      passRankDisplayCount: 3,
      ButtonTextPassRank: '더보기',

      dribbleRankPlayers: [],
      dribbleRankDisplayCount: 3,
      ButtonTextDribbleRank: '더보기',

      tackleRankPlayers: [],
      tackleRankDisplayCount: 3,
      ButtonTextTackleRank: '더보기',

    }
  },

  computed: {
    displayedMomPlayers() {
      return this.momPlayers.slice(0, this.momDisplayCount);
    },
    displayedGoalRankPlayers() {
      return this.goalRankPlayers.slice(0, this.goalRankDisplayCount);
    },
    displayedAssistRankPlayers() {
      return this.assistRankPlayers.slice(0, this.assistRankDisplayCount);
    },
    displayedPassRankPlayers() {
      return this.passRankPlayers.slice(0, this.passRankDisplayCount);
    },
    displayedTackleRankPlayers() {
      return this.tackleRankPlayers.slice(0, this.tackleRankDisplayCount);
    },
    displayedDribbleRankPlayers() {
      return this.dribbleRankPlayers.slice(0, this.dribbleRankDisplayCount);
    },


  },

  methods: {
    showMore() {
      if (this.ButtonText == '더보기') {
        this.momDisplayCount += 3;
        if (this.momDisplayCount >= this.momPlayers.length) {
          this.momDisplayCount = this.momPlayers.length;
          this.ButtonText = '접기';
        }
      } else if (this.ButtonText == '접기') {
        this.momDisplayCount = 3;
        this.ButtonText = '더보기';
      }
    },
    showMoreGoalRank() {
      if (this.ButtonTextGoalRank == '더보기') {
        this.goalRankDisplayCount += 3;
        if (this.goalRankDisplayCount >= this.goalRankPlayers.length) {
          this.goalRankDisplayCount = this.goalRankPlayers.length;
          this.ButtonTextGoalRank = '접기';
        }
      } else if (this.ButtonTextGoalRank == '접기') {
        this.goalRankDisplayCount = 3;
        this.ButtonTextGoalRank = '더보기';
      }
    },
    showMoreAssistRank() {
      if (this.ButtonTextAssistRank == '더보기') {
        this.assistRankDisplayCount += 3;
        if (this.assistRankDisplayCount >= this.assistRankPlayers.length) {
          this.assistRankDisplayCount = this.assistRankPlayers.length;
          this.ButtonTextAssistRank = '접기';
        }
      } else if (this.ButtonTextAssistRank == '접기') {
        this.assistRankDisplayCount = 3;
        this.ButtonTextAssistRank = '더보기';
      }
    },
    showMorePassRank() {
      if (this.ButtonTextPassRank == '더보기') {
        this.passRankDisplayCount += 3;
        if (this.passRankDisplayCount >= this.passRankPlayers.length) {
          this.passRankDisplayCount = this.passRankPlayers.length;
          this.ButtonTextPassRank = '접기';
        }
      } else if (this.ButtonTextPassRank == '접기') {
        this.passRankDisplayCount = 3;
        this.ButtonTextPassRank = '더보기';
      }
    },
    showMoreDribbleRank() {
      if (this.ButtonTextDribbleRank == '더보기') {
        this.dribbleRankDisplayCount += 3;
        if (this.dribbleRankDisplayCount >= this.dribbleRankPlayers.length) {
          this.dribbleRankDisplayCount = this.dribbleRankPlayers.length;
          this.ButtonTextDribbleRank = '접기';
        }
      } else if (this.ButtonTextDribbleRank == '접기') {
        this.dribbleRankDisplayCount = 3;
        this.ButtonTextAssistRank = '더보기';
      }
    },
    showMoreTackleRank() {
      if (this.ButtonTextTackleRank == '더보기') {
        this.tackleRankDisplayCount += 3;
        if (this.tackleRankDisplayCount >= this.tackleRankPlayers.length) {
          this.tackleRankDisplayCount = this.tackleRankPlayers.length;
          this.ButtonTextTackleRank = '접기';
        }
      } else if (this.ButtonTextTackleRank == '접기') {
        this.tackleRankDisplayCount = 3;
        this.ButtonTextTackleRank = '더보기';
      }
    },




    async searchPlayers(spid) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/searchPlayer?spId=${spid}`);
        const data = response.data
        return data
      } catch (error) {
        console.log("선수 검색 실패")
      }
    },



    async handleSearch() {

      this.data = null;

      this.analysisData = null;
      this.momPlayers = [];
      this.division_icon = null;
      this.controllerType = null;
      this.chartData = {};
      this.goal



      const nickName = this.$route.query.nickName;

      if (!nickName) {
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/searchNickName?nickName=${this.$route.query.nickName}&searchType=${this.$route.query.searchType}&searchMatchCount=${this.$route.query.searchMatchCount}`);
        this.data = response.data

        console.log(this.data);
        this.analysisData = this.analysis_data(response.data, nickName)



        let rankCnt =0;
        for (const [key, value] of this.analysisData.sortedMomMap.entries()) {
          if (rankCnt >=5){
            break;
          }

          //const spId = item[0];
          //const cnt = item[1];
          const spId = key;
          const cnt = value.count;
          const avgTopRating = value.total / value.count;

          const { count, total } = this.analysisData.players_rating.get(spId);

          let momPlayer = await this.searchPlayers(spId);
          momPlayer.cnt = cnt;
          momPlayer.img = 'data:image/png;base64,' + momPlayer.img;
          momPlayer.avgTopRating = avgTopRating;
          momPlayer.avgRating = total / count;
          this.momPlayers.push(momPlayer)
          rankCnt++;
        }


        rankCnt = 0;
        for (const [key, value] of this.analysisData.sortedGoalRankMap.entries()) {
          if (rankCnt >=5){
            break;
          }
          const spId = key;
          const cnt = value.count;

          const { count, total } = this.analysisData.players_rating.get(spId);

          let goalRankPlayer = await this.searchPlayers(spId);
          goalRankPlayer.cnt = cnt; // 골수
          goalRankPlayer.img = 'data:image/png;base64,' + goalRankPlayer.img;

          goalRankPlayer.avgRating = total / count;
          this.goalRankPlayers.push(goalRankPlayer)
          rankCnt++;
        }
        rankCnt = 0;

        for (const [key, value] of this.analysisData.sortedAssistRankMap.entries()) {

          if (rankCnt >=5){
            break;
          }
          const spId = key;
          const cnt = value.count;

          const { count, total } = this.analysisData.players_rating.get(spId);

          let assistRankPlayer = await this.searchPlayers(spId);
          assistRankPlayer.cnt = cnt;
          assistRankPlayer.img = 'data:image/png;base64,' + assistRankPlayer.img;
          assistRankPlayer.avgRating = total / count;

          this.assistRankPlayers.push(assistRankPlayer)
          rankCnt++;
        }

        rankCnt = 0;
        for (const [key, value] of this.analysisData.sortedDribbleRankMap.entries()) {

          if (rankCnt >=5){
            break;
          }
          const spId = key;
          const dribble = value.dribble;

          const { count, total } = this.analysisData.players_rating.get(spId);

          let dribbleRankPlayer = await this.searchPlayers(spId);
          dribbleRankPlayer.dribble = dribble;
          dribbleRankPlayer.img = 'data:image/png;base64,' + dribbleRankPlayer.img;
          dribbleRankPlayer.avgRating = total / count;

          this.dribbleRankPlayers.push(dribbleRankPlayer)
          rankCnt++;
        }

        rankCnt = 0;
        for (const [key, value] of this.analysisData.sortedPassRankMap.entries()) {

          if (rankCnt >=5){
            break;
          }
          const spId = key;
          const passTry = value.passTry;
          const passSuccess = value.passSuccess;

          const { count, total } = this.analysisData.players_rating.get(spId);

          let passRankPlayer = await this.searchPlayers(spId);
          passRankPlayer.passTry = passTry;
          passRankPlayer.passSuccess = passSuccess;
          passRankPlayer.img = 'data:image/png;base64,' + passRankPlayer.img;
          passRankPlayer.avgRating = total / count;

          this.passRankPlayers.push(passRankPlayer)
          rankCnt++;
        }

        rankCnt = 0;
        for (const [key, value] of this.analysisData.sortedTackleRankMap.entries()) {
          if (rankCnt >=5){
            break;
          }
          const spId = key;
          const tackleTry = value.tackleTry;
          const tackleSuccess = value.tackleSuccess;

          const { count, total } = this.analysisData.players_rating.get(spId);

          let tackleRankPlayer = await this.searchPlayers(spId);
          tackleRankPlayer.tackleTry = tackleTry;
          tackleRankPlayer.tackleSuccess = tackleSuccess;
          tackleRankPlayer.img = 'data:image/png;base64,' + tackleRankPlayer.img;
          tackleRankPlayer.avgRating = total / count;

          this.tackleRankPlayers.push(tackleRankPlayer)
          rankCnt++;
}



        const max = Math.max(this.analysisData.controllerTypes.keyboard, this.analysisData.controllerTypes.gamepad, this.analysisData.controllerTypes.etc)
        if (max === this.analysisData.controllerTypes.keyboard) {
          this.controllerType = "키보드"
        } else if (max === this.analysisData.controllerTypes.gamepad) {
          this.controllerType = "패드"
        } else {
          this.controllerType = "기타"
        }


        this.chartData =
        {
          'win': this.analysisData.winCount,
          'draw': this.analysisData.drawCount,
          'lose': this.analysisData.loseCount
        }

        this.shootTimeChartData = {
          'score': this.analysisData.goalTimes,
          'concede': this.analysisData.opponentGoalTimes
        }

        this.shootTypeChartData = {
          'score': this.analysisData.goalTimes,
        }

      } catch (error) {
        console.error(error);
        alert('구단주를 찾을 수 없습니다.')
        this.$router.push('/');

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
      let controllerTypes = { keyboard: 0, gamepad: 0, etc: 0 };
      let matchResult = [];

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

      let opponentShootTypes = {
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
      let opponentHitPost = 0;
      let goalTimes = [];
      let opponentGoalTimes = [];
      let player_count = 0;
      let totalSpRating = 0;

      let totalScore = 0;
      let totalConcede = 0;

      const players_rating = new Map();

      const momMap = new Map();

      const goalRankMap = new Map();
      const assistRankMap = new Map();

      /*
            passRankPlayers:[],
      passRankDisplayCount: 3,
      ButtonTextPassRank: '더보기',
      
      dribbleRankPlayers:[],
      dribbleRankDisplayCount: 3,
      ButtonTextDribbleRank: '더보기',

      tackleRankPlayers:[],
      tackleRankDisplayCount: 3,
      ButtonTextTackleRank: '더보기',
      */

      const passRankMap = new Map();
      const dribbleRankMap = new Map();
      const tackleRankMap = new Map();

      for (const match of data.matchList) {

        const targetData = match.matchInfo.filter(item => item.nickname === nickName)[0];
        const opponentData = match.matchInfo.filter(item => item.nickname != nickName)[0];


        // MatchDetailDTO
        dribbleSum += targetData.matchDetail.dribble;
        foulSum += targetData.matchDetail.foul;
        cornerKickSum += targetData.matchDetail.cornerKick;
        possessionSum += targetData.matchDetail.possession;
        offsideCountSum += targetData.matchDetail.offsideCount;
        if (targetData.matchDetail.matchResult === '승') {
          matchResult.push({ "result": "승", "score": targetData.shoot.goalTotal, "concede": opponentData.shoot.goalTotal });
          winCount++;
        } else if (targetData.matchDetail.matchResult === '무') {
          matchResult.push({ "result": "무", "score": targetData.shoot.goalTotal, "concede": opponentData.shoot.goalTotal });
          //matchResult.push("무");
          drawCount++;
        } else if (targetData.matchDetail.matchResult === '패') {
          matchResult.push({ "result": "패", "score": targetData.shoot.goalTotal, "concede": opponentData.shoot.goalTotal });
          //matchResult.push("패");
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
          if (shootDetail.result == 3) {
            totalScore += 1;
          }
          goalTime["shootType"] = shootDetail.type;
          goalTimes.push(goalTime);
          shootTypes[shootDetail.type]++;
          if (shootDetail.hitPost && shootDetail.result != 3) {
            hitPost++;
          }
        }



        const opponentShootDetailList = opponentData.shootDetail;
        for (const shootDetail of opponentShootDetailList) {
          let goalTime = this.convertGoalTime(shootDetail.goalTime);
          goalTime["result"] = shootDetail.result;
          if (shootDetail.result == 3) {
            totalConcede += 1;
          }
          opponentGoalTimes.push(goalTime);
          opponentShootTypes[shootDetail.type]++;
          if (shootDetail.hitPost && shootDetail.result != 3) {
            opponentHitPost++;
          }
        }


        let topSpRating = 0;
        let topSpId = null;

        const playerList = targetData.player;
        for (const player of playerList) {
          if (player.status.spRating != 0) {

            if (players_rating.has(player.spId)) {
              const { count, total } = players_rating.get(player.spId);
              players_rating.set(player.spId, {
                count: count + 1,
                total: total + player.status.spRating,
              })
            } else {
              players_rating.set(player.spId, {
                count: 1,
                total: player.status.spRating,
              })
            }

            totalSpRating += player.status.spRating
            player_count++;
            if (player.status.spRating > topSpRating) {
              topSpRating = player.status.spRating
              topSpId = player.spId
            }


            // 득점, 어시스트 카운트

            if (player.status.goal > 0) {
              if (goalRankMap.has(player.spId)) {
                const { count } = goalRankMap.get(player.spId);
                goalRankMap.set(player.spId, {
                  count: count + player.status.goal,

                })
              } else {
                goalRankMap.set(player.spId, {
                  count: player.status.goal,

                })
              }
            }

            if (player.status.assist > 0) {
              if (assistRankMap.has(player.spId)) {
                const { count } = assistRankMap.get(player.spId);
                assistRankMap.set(player.spId, {
                  count: count + player.status.assist,
                })
              } else {
                assistRankMap.set(player.spId, {
                  count: player.status.assist,
                })
              }
            }

            if (player.status.passTry > 0) {
              if (passRankMap.has(player.spId)) {
                const { passTry, passSuccess } = passRankMap.get(player.spId);
                passRankMap.set(player.spId, {
                  passTry: passTry + player.status.passTry,
                  passSuccess: passSuccess + player.status.passSuccess
                })
              } else {
                passRankMap.set(player.spId, {
                  passTry: player.status.passTry,
                  passSuccess: player.status.passSuccess,
                })
              }
            }


            if (player.status.dribble > 0) {
              if (dribbleRankMap.has(player.spId)) {
                const { dribble } = dribbleRankMap.get(player.spId);
                dribbleRankMap.set(player.spId, {
                  dribble: dribble + player.status.dribble,

                })
              } else {
                dribbleRankMap.set(player.spId, {
                  dribble: player.status.dribble,
                })
              }
            }

            if (player.status.tackleTry > 0) {
              if (tackleRankMap.has(player.spId)) {
                const { tackleTry, tackleSuccess } = tackleRankMap.get(player.spId);
                tackleRankMap.set(player.spId, {
                  tackleTry: tackleTry + player.status.tackleTry,
                  tackleSuccess: tackleSuccess + player.status.tackle
                })
              } else {
                tackleRankMap.set(player.spId, {
                  tackleTry: player.status.tackleTry,
                  tackleSuccess: player.status.tackle
                })
              }
            }

          }
        }

        if (topSpId){
          if (momMap.has(topSpId)) {
          const { count, total } = momMap.get(topSpId);
          momMap.set(topSpId, {
            count: count + 1,
            total: total + topSpRating,
          })
        } else {
          momMap.set(topSpId, {
            count: 1,
            total: topSpRating,
          })
        }
        }

        
      }



      // Vue 3 Map을 객체로 변환한 후, count를 기준으로 정렬합니다.
      const sortedArray = [...momMap].sort((a, b) => b[1].count - a[1].count);

      // 정렬된 배열을 다시 Vue 3 Map으로 변환합니다.
      const sortedMomMap = new Map(sortedArray);


      // Vue 3 Map을 객체로 변환한 후, count를 기준으로 정렬합니다.
      const sortedGoalRankArray = [...goalRankMap].sort((a, b) => b[1].count - a[1].count);

      // 정렬된 배열을 다시 Vue 3 Map으로 변환합니다.
      const sortedGoalRankMap = new Map(sortedGoalRankArray);



      // Vue 3 Map을 객체로 변환한 후, count를 기준으로 정렬합니다.
      const sortedassistRankArray = [...assistRankMap].sort((a, b) => b[1].count - a[1].count);

      // 정렬된 배열을 다시 Vue 3 Map으로 변환합니다.
      const sortedAssistRankMap = new Map(sortedassistRankArray);


      const sortedDribbleRankArray = [...dribbleRankMap].sort((a, b) => b[1].dribble - a[1].dribble);
      const sortedDribbleRankMap = new Map(sortedDribbleRankArray);


      const sortedPassRankArray = [...passRankMap].sort((a, b) => b[1].passTry - a[1].passTry);
      const sortedPassRankMap = new Map(sortedPassRankArray);

      const sortedTackleRankArray = [...tackleRankMap].sort((a, b) => b[1].tackleTry - a[1].tackleTry);
      const sortedTackleRankMap = new Map(sortedTackleRankArray);

      /*
      const momResult = momList.reduce((acc, cur) => {
        acc[cur] = acc[cur] ? acc[cur] + 1 : 1;
        return acc;
      }, {});
      
      const sortedMomResult = Object.entries(momResult).sort((a, b) => b[1] - a[1]);
*/
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
        goalTimes,
        totalSpRating,
        player_count,
        sortedMomMap,
        players_rating,
        matchResult,
        opponentGoalTimes,
        opponentHitPost,
        opponentShootTypes,

        totalScore,
        totalConcede,
        sortedGoalRankMap,
        sortedAssistRankMap,
        sortedDribbleRankMap,
        sortedPassRankMap,
        sortedTackleRankMap,
      };



      return analysisData
    }
  },
  watch: {
    // watch for changes in the route query object to call handleSearch method
    '$route.query': {
      immediate: true, // call the method immediately when the component is created
      handler: 'handleSearch',
    },
  }
};
</script>

<style scoped>
.v-card-text {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  padding: 0;
}</style>