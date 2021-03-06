/*
 ************************************************************************************
 * Copyright (C) 2001-2011 encuestame: system online surveys Copyright (C) 2011
 * encuestame Development Team.
 * Licensed under the Apache Software License version 2.0
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to  in writing,  software  distributed
 * under the License is distributed  on  an  "AS IS"  BASIS,  WITHOUT  WARRANTIES  OR
 * CONDITIONS OF ANY KIND, either  express  or  implied.  See  the  License  for  the
 * specific language governing permissions and limitations under the License.
 ************************************************************************************
 */
package org.encuestame.mvc.view;

import java.util.Date;

import org.encuestame.core.rss.AbstractBaseRssFeedView;
import org.joda.time.DateTime;
import org.springframework.stereotype.Component;

import com.sun.syndication.feed.rss.Channel;

/**
 * Frontend Published RSS Feed View.
 * @author Morales, Diana Paola paolaATencuestame.org
 * @since July 21, 2011
 */
@Component(value="frontEndRssFeedView")
public class FrontEndRssFeedView extends AbstractBaseRssFeedView{

    @Override
    protected Channel newFeed() {
        final Channel channel = new Channel("rss_2.0");
        channel.setPubDate(new Date());
        channel.setDescription("Last Items Published");
        channel.setTitle("Last Items Published");
        final DateTime time = new DateTime();
        channel.setCopyright(String.valueOf(time.getYear()));
        channel.setPubDate(time.toDate());
        channel.setLink("");
        return  channel;
    }
}
