<style lang="scss" scoped> 
  @import "./Credits.scss";
</style>
<template src='./Credits.html'>
</template>
<script>
import * as d3 from 'd3'
import { forceCluster } from 'd3-force-cluster'
import { forceAttract } from 'd3-force-attract'

import Credits from '@/assets/data/credits'

export default {
  name: 'Credits',
  data () {
    return {
      currentIcon: null,
      iconData: []
    }
  },
  methods: {
    getGeometry: function (ref) {
      var creditsData = Credits.ICON_CREDITS
      var clusterInfo = {
        clusters: [],
        lookups: {}
      }
      creditsData.map(function (value, key) {
        if (!clusterInfo.lookups[value.name]) {
          clusterInfo.lookups[value.name] = clusterInfo.clusters.length + 1
          clusterInfo.clusters.push(value.name)
        }
        value.cluster = clusterInfo.lookups[value.name]
      })
      return {
        height: 600,
        width: ref.clientWidth,
        r: 18,
        k: 0,
        padding: 1,
        clusterPadding: 3,
        maxRadius: 30,
        minRadius: 10,
        tn: Credits.ICON_CREDITS.length,
        tc: clusterInfo.clusters.length,
        iconData: creditsData
      }
    },
    updateCurrentIcon: function (d) {
      this.currentIcon = d
      this.$forceUpdate()
    },
    drawViz: function (ref) {
      // https://bl.ocks.org/ericsoco/d2d49d95d2f75552ac64f0125440b35e
      var geometry = this.getGeometry(ref)
      this.iconData = geometry.iconData
      var parent = this
      var svg = d3.select('#credit-viz')
        .attr('width', geometry.width)
        .attr('height', geometry.height)
      var color = d3.scaleSequential(d3.interpolateRainbow).domain(d3.range(geometry.tc))
      var clusters = new Array(geometry.tc)
      var nodes = d3.range(geometry.tn).map(function () {
        var i = geometry.iconData[geometry.k].cluster
        var r = Math.sqrt((i + 1) / geometry.tc * -Math.log(Math.random())) * geometry.maxRadius
        if (r < geometry.minRadius) {
          r = geometry.minRadius
        }
        var d = {
          cluster: i,
          radius: r,
          label: geometry.iconData[geometry.k].label,
          name: geometry.iconData[geometry.k].name,
          webHref: geometry.iconData[geometry.k].webHref,
          imageHref: geometry.iconData[geometry.k].imageHref,
          x: Math.cos(i / geometry.tc * 2 * Math.PI) * 200 + geometry.width / 2 + Math.random(),
          y: Math.sin(i / geometry.tc * 2 * Math.PI) * 200 + geometry.height / 2 + Math.random()
        }
        geometry.k++
        if (!clusters[i] || (r > clusters[i].radius)) {
          clusters[i] = d
        }
        return d
      })
      var simulation = d3.forceSimulation()
      .force('center', d3.forceCenter(geometry.width / 2, geometry.height / 2))
      .force('attract', forceAttract()
        .target([geometry.width / 2, geometry.height / 2])
        .strength(0.01))
      .force('cluster', forceCluster()
        .centers(function (d) { return clusters[d.cluster] })
        .strength(0.5)
        .centerInertia(0.1))
      .force('collide', d3.forceCollide(function (d) { return d.radius + geometry.padding })
        .strength(0))
      .on('tick', layoutTick)
      .nodes(nodes)
      var geode = svg.append('g').attr('class', 'crediter')
      var node = geode.selectAll('circle')
        .data(nodes)
        .enter().append('circle')
          .attr('x', function (d) { return -25 })
          .attr('y', function (d) { return -25 })
          .attr('height', 50)
          .attr('width', 50)
          .style('fill', function (d) { return color(d.cluster / 10) })
          .on('mouseenter', function () {
            d3.select(this)
              .transition()
              .attr('x', function (d) { return -60 })
              .attr('y', function (d) { return -60 })
              .attr('height', 100)
              .attr('width', 100)
          })
          .on('mouseover', function (d) {
            parent.updateCurrentIcon(d)
          })
          .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
          )
      function dragstarted (d) {
        if (!d3.event.active) {
          simulation.alphaTarget(0.3).restart()
        }
        d.fx = d.x
        d.fy = d.y
      }
      function dragged (d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }
      function dragended (d) {
        if (!d3.event.active) {
          simulation.alphaTarget(0)
        }
        d.fx = null
        d.fy = null
        parent.updateCurrentIcon(d)
      }
      var transitionTime = 3000
      var t = d3.timer(function (elapsed) {
        var dt = elapsed / transitionTime
        simulation.force('collide').strength(Math.pow(dt, 2) * 0.7)
        if (dt >= 1.0) {
          t.stop()
        }
      })
      function layoutTick (e) {
        node
          .attr('cx', function (d) { return d.x })
          .attr('cy', function (d) { return d.y })
          .attr('r', function (d) { return d.radius })
      }
    }
  },
  mounted: function () {
    this.drawViz(this.$refs.viz)
  }
}
</script>