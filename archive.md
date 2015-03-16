---
layout: page
title: Archive
permalink: /archive/
feature-img: "img/21469500_59b96ec376_o.jpg"
---

<!-- <ul> -->
<!--   {% for post in site.posts %} -->
<!--     <li> -->
<!--       <a href="{{ post.url }}">{{ post.title }}</a> -->
<!--     </li> -->
<!--   {% endfor %} -->
<!-- </ul> -->

{% capture tags %}
  {% for tag in site.tags %}
    {{ tag[0] }}
  {% endfor %}
{% endcapture %}
{% assign sortedtags = tags | split:' ' | sort %}

{% for tag in sortedtags %}
  <h3 id="{{ tag }}">{{ tag }}</h3>
  <ul>
  {% for post in site.tags[tag] %}
    <li><a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
  </ul>
{% endfor %}
